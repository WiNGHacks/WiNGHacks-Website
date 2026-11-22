export const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
export const BACKUP_TTL_MS = 24 * 60 * 60 * 1000;

export function clearBackups(storage, prefix) {
  try {
    Object.keys(storage).filter(key => key.startsWith(prefix)).forEach(key => storage.removeItem(key));
  } catch { /* Browser storage may be disabled. */ }
}

export function clearUserBackups(storage, userId) {
  clearBackups(storage, `winghacks:draft:${userId}:`);
  clearBackups(storage, `winghacks:review:${userId}:`);
}

export function loadBackup(storage, key, now = Date.now()) {
  try {
    const value = JSON.parse(storage.getItem(key));
    if (!value || !Number.isFinite(value.expiresAt) || value.expiresAt <= now) {
      storage.removeItem(key);
      return null;
    }
    return value;
  } catch {
    try { storage.removeItem(key); } catch {}
    return null;
  }
}
export function mergeAnswers(base, local, remote) {
  const answers = { ...remote }, conflicts = [];
  for (const key of new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)])) {
    if (same(local[key], base[key])) continue;
    if (!same(remote[key], base[key]) && !same(remote[key], local[key])) conflicts.push(key);
    answers[key] = local[key];
  }
  return { answers, conflicts };
}
// One backup per mounted editor: another tab can never overwrite this editor's unsent work.
export class DraftStore {
  constructor(api, doc, prefix, storage, emit) {
    Object.assign(this, { api, doc, answers: { ...doc.answers }, prefix, storage, emit, conflicts: [], message: '', serverErrors: {}, storageError: '', pending: null, busy: false, disposed: false });
    this.key = prefix + Date.now() + '-' + Math.random().toString(36).slice(2);
  }
  get dirty() { return !same(this.answers, this.doc.answers); }
  get locked() { return this.doc.state !== 'draft' || Boolean(this.doc.deletedAt); }
  notify() { if (!this.disposed) this.emit(); }
  persist() {
    try {
      if (this.dirty) {
        const at = Date.now();
        this.storage.setItem(this.key, JSON.stringify({ answers: this.answers, base: this.doc.answers, at, expiresAt: at + BACKUP_TTL_MS }));
      }
      else this.storage.removeItem(this.key);
      this.storageError = '';
    } catch { this.storageError = 'Browser backup is unavailable. Keep this page open until saved, or download your answers.'; }
  }
  set(key, value) { if (this.locked || this.busy) return; this.answers = { ...this.answers, [key]: value }; this.message = ''; this.serverErrors = { ...this.serverErrors, [key]: undefined }; this.persist(); this.notify(); }
  acceptRemote(remote, base) {
    const merged = mergeAnswers(base, this.answers, remote.answers);
    this.doc = remote; this.answers = merged.answers; this.conflicts = merged.conflicts;
    this.persist(); this.notify();
  }
  recover(backup) { this.answers = backup.answers; this.acceptRemote(this.doc, backup.base); }
  resolve(key, useLocal) {
    if (!useLocal) this.answers = { ...this.answers, [key]: this.doc.answers[key] };
    this.conflicts = this.conflicts.filter(k => k !== key); this.persist(); this.notify();
  }
  async flush() {
    if (this.pending) { const ok = await this.pending; return ok && this.dirty ? this.flush() : ok; }
    if (this.locked || this.conflicts.length || this.busy) return !this.dirty && !this.conflicts.length;
    if (!this.dirty) return true;
    const base = this.doc.answers, answers = this.answers, revision = this.doc.revision;
    this.pending = (async () => {
      try {
        const { data } = await this.api.patch('/applications/me', { revision, answers }, { timeout: 20000 });
        this.doc = data; this.message = ''; this.serverErrors = {}; this.persist(); return true;
      } catch (e) {
        const remote = e.response?.data?.current;
        if (remote) {
          this.acceptRemote(remote, base);
          if (!this.dirty && !this.conflicts.length) { this.message = ''; this.serverErrors = {}; return true; }
        }
        this.serverErrors = e.response?.data?.errors || {};
        this.message = e.response?.data?.message || 'Save not confirmed. Your answers are backed up in this browser; reconnect or sign in again, then retry.';
        return false;
      } finally { this.pending = null; this.notify(); }
    })();
    this.notify(); return this.pending;
  }
  // Serializes uploads/submission behind every outstanding text save.
  async action(operation) {
    if (this.busy) return null;
    if (!await this.flush() || this.dirty || this.locked || this.conflicts.length || this.busy) return null;
    this.busy = true; this.notify();
    try {
      const { data } = await operation(this.doc.revision);
      this.doc = data; this.answers = { ...data.answers }; this.message = '';
      if (data.state === 'submitted') clearBackups(this.storage, this.prefix);
      else this.persist();
      return data;
    } catch (e) {
      if (e.response?.data?.current) this.acceptRemote(e.response.data.current, this.doc.answers);
      this.message = e.response?.data?.message || 'Request not confirmed. Retry safely; your saved answers are preserved.';
      throw e;
    } finally { this.busy = false; this.notify(); }
  }
}
export function backups(storage, prefix) {
  try { return Object.keys(storage).filter(k => k.startsWith(prefix)).map(key => {
    const value = loadBackup(storage, key);
    return value?.answers && value?.base ? { key, ...value } : null;
  }).filter(Boolean).sort((a, b) => b.at - a.at); } catch { return []; }
}
export function downloadFile(content, filename, type = 'application/json') {
  const url = URL.createObjectURL(content instanceof Blob ? content : new Blob([content], { type }));
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

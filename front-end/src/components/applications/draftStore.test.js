import { BACKUP_TTL_MS, DraftStore, backups, clearUserBackups, mergeAnswers } from './draftStore';
const doc = { answers:{firstName:'A',school:'UF'}, revision:0,state:'draft' };
function setup(api, storage = { setItem:jest.fn(),removeItem:jest.fn() }) { return new DraftStore(api,doc,'test:',storage,jest.fn()); }
test('merges non-overlapping edits and identifies overlapping edits',()=> {
  expect(mergeAnswers(doc.answers,{...doc.answers,firstName:'B'},{...doc.answers,school:'Other'})).toEqual({answers:{firstName:'B',school:'Other'},conflicts:[]});
  expect(mergeAnswers(doc.answers,{firstName:'B'},{firstName:'C'}).conflicts).toContain('firstName');
});
test('typing during save preserves newer changes and serializes subsequent saves',async()=> {
  let resolve; const api={patch:jest.fn().mockImplementationOnce(()=>new Promise(r=>{resolve=r;})).mockResolvedValueOnce({data:{...doc,revision:2,answers:{...doc.answers,firstName:'C'}}})};
  const store=setup(api); store.set('firstName','B'); const first=store.flush(); store.set('firstName','C');
  resolve({data:{...doc,revision:1,answers:{...doc.answers,firstName:'B'}}}); await first;
  expect(store.answers.firstName).toBe('C'); expect(store.dirty).toBe(true); await store.flush(); expect(store.dirty).toBe(false); expect(api.patch.mock.calls[1][1].revision).toBe(1);
});
test('offline failure preserves local backup and retry can save',async()=> {
  const api={patch:jest.fn().mockRejectedValueOnce(Error('offline')).mockResolvedValueOnce({data:{...doc,revision:1,answers:{...doc.answers,firstName:'B'}}})};
  const store=setup(api);store.set('firstName','B'); expect(await store.flush()).toBe(false);expect(store.dirty).toBe(true);expect(store.storage.setItem).toHaveBeenCalled();expect(await store.flush()).toBe(true);
});
test('conflicts cannot silently overwrite remote values',async()=> {
  const api={patch:jest.fn().mockRejectedValue({response:{data:{current:{...doc,revision:1,answers:{...doc.answers,firstName:'C'}},message:'Conflict'}}})};
  const store=setup(api);store.set('firstName','B');await store.flush();expect(store.conflicts).toEqual(['firstName']);await store.flush();expect(api.patch).toHaveBeenCalledTimes(1);store.resolve('firstName',false);expect(store.answers.firstName).toBe('C');expect(store.dirty).toBe(false);
});
test('submission and resume operations cannot run while dirty save fails',async()=> {
  const store=setup({patch:jest.fn().mockRejectedValue(Error('offline'))});store.set('firstName','B');const action=jest.fn();await store.action(action);expect(action).not.toHaveBeenCalled();
});
test('storage failures are visible and do not prevent server saves',async()=> {
  const store=setup({patch:jest.fn().mockResolvedValue({data:{...doc,revision:1,answers:{...doc.answers,firstName:'B'}}})},{setItem(){throw Error();},removeItem(){throw Error();}});store.set('firstName','B');expect(store.storageError).toContain('unavailable');expect(await store.flush()).toBe(true);
});
test('submitted applications never autosave recovered drafts',async()=> {
  const api={patch:jest.fn()}; const store=setup(api);store.doc={...doc,state:'submitted'};store.recover({base:doc.answers,answers:{...doc.answers,firstName:'B'}});await store.flush();expect(api.patch).not.toHaveBeenCalled();expect(store.answers.firstName).toBe('B');
});
test('lost save acknowledgment reconciles an identical server copy without a conflict',async()=> {
  const remote={...doc,revision:1,answers:{...doc.answers,firstName:'B'}};
  const store=setup({patch:jest.fn().mockRejectedValue({response:{data:{current:remote,message:'Conflict'}}})});store.set('firstName','B');expect(await store.flush()).toBe(true);expect(store.dirty).toBe(false);expect(store.message).toBe('');
});
test('expired backups are removed and cleanup remains account scoped',()=> {
  const storage=window.localStorage;storage.clear();
  storage.setItem('winghacks:draft:user-a:2027:old',JSON.stringify({answers:{},base:{},at:1,expiresAt:Date.now()-1}));
  storage.setItem('winghacks:draft:user-a:2027:new',JSON.stringify({answers:{},base:{},at:2,expiresAt:Date.now()+BACKUP_TTL_MS}));
  storage.setItem('winghacks:review:user-a:app',JSON.stringify({expiresAt:Date.now()+BACKUP_TTL_MS}));
  storage.setItem('winghacks:draft:user-b:2027:new',JSON.stringify({answers:{},base:{},at:3,expiresAt:Date.now()+BACKUP_TTL_MS}));
  expect(backups(storage,'winghacks:draft:user-a:2027:')).toHaveLength(1);
  expect(storage.getItem('winghacks:draft:user-a:2027:old')).toBeNull();
  clearUserBackups(storage,'user-a');
  expect(storage.getItem('winghacks:draft:user-a:2027:new')).toBeNull();
  expect(storage.getItem('winghacks:review:user-a:app')).toBeNull();
  expect(storage.getItem('winghacks:draft:user-b:2027:new')).not.toBeNull();
  storage.clear();
});
test('successful submission removes all recovery copies for that application',async()=> {
  const storage=window.localStorage;storage.clear();
  const saved={...doc,revision:1,answers:{...doc.answers,firstName:'B'}};
  const api={patch:jest.fn().mockResolvedValueOnce({data:saved}).mockResolvedValueOnce({data:{...saved,state:'submitted',revision:2}})};
  const store=new DraftStore(api,doc,'winghacks:draft:user-a:2027:',storage,jest.fn());
  storage.setItem('winghacks:draft:user-a:2027:older',JSON.stringify({answers:{},base:{},at:1,expiresAt:Date.now()+BACKUP_TTL_MS}));
  store.set('firstName','B');
  await store.action(revision=>api.patch('/applications/me/submit',{revision}));
  expect(Object.keys(storage).filter(key=>key.startsWith('winghacks:draft:user-a:2027:'))).toHaveLength(0);
});

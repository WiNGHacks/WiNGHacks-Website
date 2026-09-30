"""Generate homepage WebP assets with cwebp (brew install webp).
Original artwork/photos are kept for future editing. Run from any directory.
"""
from pathlib import Path
import re
import subprocess

root = Path(__file__).resolve().parents[1]
files = [root / 'src/components/data/MemberList.js', root / 'src/components/pages/MeadowHome.js', root / 'src/components/pages/MeadowHome.css', root / 'src/components/pages/MeadowPlayful.css']
original_total = optimized_total = 0
seen = set()
for source in files:
    content = source.read_text()
    for relative in re.findall(r'[\"\x27](\.\./pictures/[^\"\x27]+)[\"\x27]', content):
        asset = (source.parent / relative).resolve()
        if asset.suffix.lower() == '.webp':
            candidates = [p for p in asset.parent.glob(asset.stem + '.*') if p.suffix.lower() in ('.jpg', '.jpeg', '.png')]
            if not candidates:
                continue
            asset = candidates[0]
        output = asset.with_suffix('.webp')
        if asset not in seen:
            seen.add(asset)
            width = 480 if 'profile_pics' in str(asset) else 1600 if 'landscape' in asset.name or 'poster' in asset.name else 800
            subprocess.run(['cwebp', '-quiet', '-q', '78', '-m', '6', '-resize', str(width), '0', str(asset), '-o', str(output)], check=True)
            original_total += asset.stat().st_size
            optimized_total += output.stat().st_size
        content = content.replace(relative, str(Path(relative).with_suffix('.webp')))
    source.write_text(content)
print(f'Referenced images: {original_total:,} -> {optimized_total:,} bytes ({100 * (1 - optimized_total / original_total):.1f}% smaller)')

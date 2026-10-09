"""Silent full-frame HD performance B-roll; original recordings remain untouched."""
import hashlib
import io
import json
import math
import subprocess
from pathlib import Path

import imageio_ffmpeg
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'music/media/clip3.mp4'
OUT = ROOT / 'theatre/assets/v2'
QA = ROOT.parent / 'theatre-qa/guitar-portrait-review'
CLIPS = [
    ('blue', 42.5, 5.19, 10.3913, 3),
    ('warm', 78.2, 10.3913, 20.7706, 5),
    ('violet', 88.6, 20.7706, 28.5028, 6.5),
]


def digest(path):
    return {'bytes': path.stat().st_size,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}


def main():
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    QA.mkdir(exist_ok=True, parents=True)
    report = {
        'source': 'music/media/clip3.mp4',
        'sourceSha256': digest(SOURCE)['sha256'],
        'sourceSize': [1300, 2304],
        'sourceFrameRate': '24000/1001',
        'ownership': 'Existing user-supplied band footage in this portfolio. Original and duplicate preserved.',
        'use': 'Silent supplementary performance footage, labelled Other moments / live. Different moments from the band recording, not synchronized alternate camera angles of the audible main solo.',
        'replaces': ['guitar-broll-blue.mp4', 'guitar-broll-warm.mp4'],
        'clips': [],
    }
    for colour, start, local_in, local_out, poster_at in CLIPS:
        name = 'guitar-portrait-' + colour
        video = OUT / (name + '.mp4')
        poster = OUT / (name + '-poster.jpg')
        frames = math.floor((local_out - local_in) * 24 + 1e-7)
        duration = frames / 24
        # Fit the complete native frame, preserving its aspect ratio. Two-pixel
        # top/bottom borders account for the native ratio's tiny difference.
        filters = 'scale=720:1276:flags=lanczos,pad=720:1280:0:2:black,setsar=1,fps=24'
        subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-ss', str(start),
                        '-i', str(SOURCE), '-frames:v', str(frames), '-an', '-vf', filters,
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '21',
                        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', str(video)], check=True)
        subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-ss', str(poster_at),
                        '-i', str(video), '-frames:v', '1', '-q:v', '3', '-y', str(poster)], check=True)
        subprocess.run([ff, '-hide_banner', '-loglevel', 'error', '-i', str(video),
                        '-f', 'null', '-'], check=True)
        count, _ = imageio_ffmpeg.count_frames_and_secs(str(video))
        assert count == frames
        times = [i * .5 for i in range(math.ceil(duration / .5))] + [(frames - 1) / 24]
        sheet = Image.new('RGB', (1140, 365 * math.ceil(len(times) / 6)), '#171717')
        draw = ImageDraw.Draw(sheet)
        for i, time in enumerate(times):
            data = subprocess.check_output([ff, '-hide_banner', '-loglevel', 'error',
                                            '-ss', str(time), '-i', str(video), '-frames:v', '1',
                                            '-vf', 'scale=190:-1', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-'])
            im = Image.open(io.BytesIO(data))
            x, y = i % 6 * 190, i // 6 * 365
            sheet.paste(im, (x, y))
            draw.text((x + 3, y + 339), f'{colour} +{time:.3f} / {start + time:.3f}', fill='white')
        sheet.save(QA / (colour + '-output-review.jpg'), quality=92)
        record = {
            'video': video.name, 'poster': poster.name,
            'sourceInSeconds': start, 'sourceOutSeconds': start + duration,
            'outputSize': [720, 1280], 'contentSize': [720, 1276],
            'crop': None, 'paddingPixels': {'top': 2, 'bottom': 2, 'left': 0, 'right': 0},
            'upscaled': False, 'audioStream': False, 'frameRate': 24,
            'frameCount': frames, 'durationSeconds': duration,
            'mainChapterLocalInSeconds': local_in, 'mainChapterLocalOutSeconds': local_out,
            'finalFrameHoldSeconds': local_out - local_in - duration,
            'timeTreatment': 'No speed change. Native approximately 23.976fps sampled at24fps; complete-frame duration is rounded down to the nearest output frame.',
            'composition': 'Complete native portrait frame; head, face, instrument body and torso remain framed. No crop. The violet source camera briefly places the far guitar neck/fretting hand at the right edge; the performer face remains visible. Original lighting and head movements are preserved.',
            'posterLocalSeconds': poster_at, 'posterSourceSeconds': start + poster_at,
            'files': {video.name: digest(video), poster.name: digest(poster)},
        }
        report['clips'].append(record)
    (OUT / 'guitar-portraits.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()

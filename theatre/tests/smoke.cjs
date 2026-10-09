/*
 * Run against the existing static site, served separately.
 * THEATRE_URL defaults to http://127.0.0.1:4293/.
 * PLAYWRIGHT_MODULE can point to an existing Playwright installation.
 * BROWSER_ENGINE=webkit or BROWSER_CHANNEL=msedge are optional.
 * No production test hooks or application dependencies are required.
 */
const assert = require('node:assert/strict');
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.THEATRE_URL || 'http://127.0.0.1:4293/';
const stage = '#theatre-stage';
const control = action => `${stage} [data-action="${action}"]`;
const currentVideo = `${stage} .tm-shot:not(.tm-outgoing) .tm-video`;

async function main() {
  const engine = process.env.BROWSER_ENGINE || 'chromium';
  const browser = await playwright[engine].launch({
    headless: true,
    ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {})
  });
  const errors = [];
  async function page(options = {}) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
    const tab = await context.newPage();
    tab.on('pageerror', error => errors.push(error.message));
    await tab.goto(base);
    return tab;
  }
  async function launch(tab) {
    await tab.locator('[data-theatre-launch]').click();
    await tab.locator(stage).waitFor({ state: 'visible' });
  }
  const chapter = tab => tab.locator(stage).getAttribute('data-chapter');
  const progress = tab => tab.locator('[data-theatre-progress]').getAttribute('aria-valuenow');
  async function close(tab) { await tab.context().close(); }
  try {
    const tab = await page();
    await tab.waitForTimeout(200);
    assert.equal(await tab.locator(stage).count(), 0, 'The tour must be opt-in');
    assert.equal(await tab.evaluate(() => performance.getEntriesByType('resource').some(
      resource => /\/theatre\/(theatre\.|chapters\.|presentation\.|sound\.|assets\/)/.test(resource.name)
    )), false, 'Presentation code and media must stay lazy');

    // Read editorial data only after the opt-in/lazy-loading assertion above.
    let chapterIds, chapters;

    // Repeated entry catches the first-RAF timestamp regression and stale sessions.
    for (let cycle = 0; cycle < 8; cycle++) {
      await launch(tab);
      if (!chapters) {
        chapters = await tab.evaluate(async () => {
          const revision = document.querySelector('#theatre-stage').dataset.revision;
          return (await import(`/theatre/chapters.js?v=${revision}`)).chapters;
        });
        chapterIds = chapters.map(item => item.id);
      }
      await tab.waitForTimeout(120);
      assert.equal(await chapter(tab), chapterIds[0]);
      await tab.locator(control('pause')).click();
      const frozen = await progress(tab);
      await tab.waitForTimeout(100);
      assert.equal(await progress(tab), frozen);
      await tab.locator(control('next')).click();
      assert.equal(await chapter(tab), chapterIds[1]);
      await tab.locator(control('back')).click();
      assert.equal(await chapter(tab), chapterIds[0]);
      await tab.keyboard.press('Escape');
      await tab.locator(stage).waitFor({ state: 'detached' });
      assert.equal(await tab.evaluate(() => document.documentElement.hasAttribute('data-theatre')), false);
      assert.equal(await tab.locator('[data-theatre-launch]').evaluate(element => element === document.activeElement), true);
      assert.equal(await tab.evaluate(() => scrollY), 0, 'Escape must return to the hero');
    }
    await launch(tab);
    await tab.locator(`${stage} .theatre-link`).focus();
    await tab.waitForFunction(next => document.querySelector('#theatre-stage')?.dataset.chapter === next, chapterIds[1]);
    assert.equal(await tab.locator(stage).evaluate(element => element.contains(document.activeElement)), true,
      'An automatic chapter boundary must retain useful focus inside the presentation');
    assert.equal(await tab.evaluate(() => scrollY), 0, 'Playing chapters must not move the ordinary page');
    const takeoverTarget = await tab.evaluate(anchor => {
      const target = document.querySelector(anchor);
      const header = document.querySelector('[data-header]')?.offsetHeight || 0;
      return Math.max(0, Math.min(target.getBoundingClientRect().top + scrollY - header - 24,
        document.documentElement.scrollHeight - innerHeight));
    }, chapters[1].anchor);
    await tab.mouse.wheel(0, 160);
    await tab.locator(stage).waitFor({ state: 'detached' });
    assert.equal(await tab.locator('[data-theatre-launch]').evaluate(element => element === document.activeElement), false);
    assert.ok(Math.abs(await tab.evaluate(() => scrollY) - takeoverTarget) < 220,
      'Wheel takeover should reveal the chapter’s relevant ordinary section');

    // Explicit exit from a later chapter always restores the beginning of the page.
    await launch(tab);
    for (let index = 0; index < chapterIds.indexOf('music'); index++) await tab.locator(control('next')).click();
    await tab.locator(control('exit')).click();
    await tab.locator(stage).waitFor({ state: 'detached' });
    assert.equal(await tab.evaluate(() => scrollY), 0, 'Exit must return to the hero even from music');

    // The final chapter hides the otherwise persistent destination link.
    await launch(tab);
    for (let index = 0; index < chapterIds.length - 2; index++) await tab.locator(control('next')).click();
    await tab.locator(`${stage} .theatre-link`).focus();
    await tab.waitForFunction(last => document.querySelector('#theatre-stage')?.dataset.chapter === last, chapterIds.at(-1));
    assert.equal(await tab.locator(control('pause')).evaluate(element => element === document.activeElement), true,
      'Hiding a focused destination link must move focus to a stable control');
    await tab.locator(stage).waitFor({ state: 'detached', timeout: 15000 });
    assert.equal(await tab.evaluate(() => scrollY), 0, 'Natural completion must return to the hero');
    assert.equal(await tab.locator('#hero-title').evaluate(element => element === document.activeElement), true);
    assert.equal(await tab.locator('.theatre-handoff').count(), 0, 'Completion must leave the ordinary hero unchanged');
    assert.equal(await tab.locator('[data-theatre-launch]').count(), 1, 'The original invitation is the only launch control');
    assert.equal(await tab.locator('[data-handoff-replay], [data-action="replay"], [data-action="explore"]').count(), 0);
    await launch(tab);
    assert.equal(await chapter(tab), chapterIds[0], 'Repeat entry uses the original invitation');
    await tab.keyboard.press('Escape');
    await close(tab);
    console.log('PASS: opt-in, lazy loading, repeated lifecycle, focus and scroll takeover');

    const manual = await page({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await launch(manual);
    assert.equal(await manual.locator(stage).getAttribute('data-state'), 'paused');
    const initialScroll = await manual.evaluate(() => scrollY);
    await manual.locator(control('next')).click();
    assert.equal(await chapter(manual), chapterIds[1]);
    assert.equal(await manual.locator(`${stage} video`).count(), 0);
    assert.equal(await manual.evaluate(() => scrollY), initialScroll);
    assert.equal(await manual.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    for (let index = 1; index < chapterIds.indexOf('music'); index++) await manual.locator(control('next')).click();
    assert.equal(await manual.locator(`${stage} video`).count(), 0, 'Reduced motion omits the main performance and all B-roll players');
    await manual.evaluate(() => {
      for (const [type, y] of [['touchstart', 200], ['touchmove', 240]]) {
        const event = new Event(type);
        Object.defineProperty(event, 'touches', { value: [{ clientX: 100, clientY: y }] });
        window.dispatchEvent(event);
      }
    });
    await manual.locator(stage).waitFor({ state: 'detached' });
    assert.equal(await manual.locator('.theatre-handoff').count(), 0, 'Takeover should not insert a completion message');
    assert.ok(Math.abs(await manual.locator('#music').evaluate(element => element.getBoundingClientRect().top) -
      await manual.locator('[data-header]').evaluate(element => element.offsetHeight) - 24) < 3,
    'Touch takeover during music should reveal the music section');
    await launch(manual);
    for (let index = 0; index < chapterIds.length - 1; index++) await manual.locator(control('next')).click();
    await manual.locator(control('next')).click();
    await manual.locator(stage).waitFor({ state: 'detached' });
    assert.equal(await manual.evaluate(() => scrollY), 0);
    assert.equal(await manual.locator('.theatre-handoff').count(), 0, 'Finishing must not inject controls into the ordinary page');
    assert.equal(await manual.locator('[data-theatre-launch]').count(), 1);
    await launch(manual);
    assert.equal(await chapter(manual), chapterIds[0]);
    await close(manual);
    console.log('PASS: reduced motion, static media and mobile width');

    const transitions = await page();
    await launch(transitions);
    await transitions.locator(control('next')).click();
    await transitions.waitForFunction(selector => document.querySelector(selector)?.currentTime > .25, currentVideo);
    await transitions.evaluate(selector => { window.__qaOutgoingVideo = document.querySelector(selector); }, currentVideo);
    await transitions.locator(control('next')).click();
    assert.equal(await transitions.locator('.theatre-scene > .tm-shot').count(), 2, 'A transition retains one outgoing scene');
    assert.equal(await transitions.locator('.tm-outgoing').getAttribute('aria-hidden'), 'true');
    assert.equal(await transitions.locator('.tm-outgoing').evaluate(element => element.inert), true);
    assert.equal(await transitions.evaluate(() => window.__qaOutgoingVideo.paused && window.__qaOutgoingVideo.hasAttribute('src')), true,
      'The outgoing picture holds its actual frame during the dissolve');
    await transitions.locator(control('pause')).click();
    const blend = await transitions.locator('.theatre-scene').evaluate(element => element.style.getPropertyValue('--scene-progress'));
    await transitions.waitForTimeout(250);
    assert.equal(await transitions.locator('.theatre-scene').evaluate(element => element.style.getPropertyValue('--scene-progress')), blend,
      'Pause freezes the transition on the same presentation clock');
    await transitions.locator(control('pause')).click();
    await transitions.locator('.tm-outgoing').waitFor({ state: 'detached' });
    assert.equal(await transitions.evaluate(() => !window.__qaOutgoingVideo.hasAttribute('src') && !window.__qaOutgoingVideo.isConnected), true,
      'The outgoing decoder is released after the dissolve');
    await transitions.locator(control('next')).click();
    await transitions.locator(control('next')).click();
    await transitions.locator(control('back')).click();
    assert.ok(await transitions.locator('.theatre-scene > .tm-shot').count() <= 2, 'Rapid navigation cannot accumulate stale scenes');
    await transitions.evaluate(() => { window.__qaTransitionVideos = [...document.querySelectorAll('#theatre-stage video')]; });
    await transitions.keyboard.press('Escape');
    assert.equal(await transitions.evaluate(() => window.__qaTransitionVideos.every(video => video.paused && !video.hasAttribute('src') && !video.isConnected)), true);
    await close(transitions);
    console.log('PASS: scene dissolve, paused frame retention, rapid navigation and cleanup');

    const ambientChapter = chapters.findIndex(item => item.ambientVideos?.length);
    if (ambientChapter >= 0) {
      const inserts = await page();
      await launch(inserts);
      await inserts.locator(control('pause')).click();
      for (let index = 0; index < ambientChapter; index++) await inserts.locator(control('next')).click();
      assert.equal(await inserts.locator(`${stage} .tm-ambient-video`).count(), chapters[ambientChapter].ambientVideos.length);
      if (chapters[ambientChapter].ambientVideos.every(item => item.start > 1)) {
        assert.equal(await inserts.locator(`${stage} .tm-ambient-video`).evaluateAll(videos => videos.every(video => !video.hasAttribute('src'))), true,
          'B-roll waits until its window approaches before loading');
      }
      await inserts.locator(control('pause')).click();
      await inserts.waitForFunction(() => [...document.querySelectorAll('#theatre-stage .tm-ambient-video')].some(video => !video.paused && video.currentTime > .3), null,
        { timeout: (Math.min(...chapters[ambientChapter].ambientVideos.map(item => item.start)) + 8) * 1000 });
      await inserts.locator(control('pause')).click();
      const positions = await inserts.locator(`${stage} video`).evaluateAll(videos => videos.map(video => video.currentTime));
      await inserts.waitForTimeout(250);
      assert.equal(await inserts.locator(`${stage} video`).evaluateAll(videos => videos.every(video => video.paused && video.muted)), true,
        'Pause owns every silent picture player');
      const frozen = await inserts.locator(`${stage} video`).evaluateAll(videos => videos.map(video => video.currentTime));
      assert.ok(frozen.every((time, index) => Math.abs(time - positions[index]) < .08));
      await inserts.evaluate(() => { window.__qaExitedVideos = [...document.querySelectorAll('#theatre-stage video')]; });
      await inserts.keyboard.press('Escape');
      assert.equal(await inserts.evaluate(() => window.__qaExitedVideos.every(video => video.paused && !video.hasAttribute('src') && !video.isConnected)), true,
        'Exit releases main and B-roll media resources');
      await close(inserts);
      console.log('PASS: B-roll lazy windows, shared pause and media disposal');
    }

    // The Windows WebKit media backend bypasses Playwright request routing.
    // Exercise this network fixture in Chromium; WebKit still runs real playback above.
    if (engine !== 'webkit') {
      // Delayed media must freeze both clocks at the live entrance, then respect Pause.
      const delayedClip = await page();
      let releaseClip;
      const clipGate = new Promise(resolve => { releaseClip = resolve; });
      await delayedClip.route(/\/guitar-synced\.mp4(?:\?.*)?$/, async route => { await clipGate; await route.continue(); });
      await launch(delayedClip);
      for (let index = 0; index < chapterIds.indexOf('music'); index++) await delayedClip.locator(control('next')).click();
      await delayedClip.locator(`${stage}[data-buffering="true"]`).waitFor();
      const waitingProgress = await progress(delayedClip);
      await delayedClip.waitForTimeout(350);
      assert.equal(await progress(delayedClip), waitingProgress, 'The live entrance must wait for its first frame');
      await delayedClip.locator(control('pause')).click();
      releaseClip();
      await delayedClip.waitForFunction(selector => document.querySelector(selector)?.readyState >= 2, currentVideo);
      assert.equal(await delayedClip.locator(stage).getAttribute('data-state'), 'paused');
      assert.equal(await delayedClip.locator(currentVideo).evaluate(video => video.paused), true,
        'Late media readiness must not undo the viewer’s Pause');
      await delayedClip.locator(control('pause')).click();
      await delayedClip.waitForFunction(selector => document.querySelector(selector)?.currentTime > .4, currentVideo);
      await delayedClip.keyboard.press('Escape');
      await close(delayedClip);
      console.log('PASS: delayed performance readiness and pause ownership');
    } else console.log('SKIP: delayed-video route fixture (WebKit native media bypasses request routing)');

    const delayed = await page();
    await delayed.route(/\/theatre\/theatre\.js(?:\?.*)?$/, async route => {
      await new Promise(resolve => setTimeout(resolve, 600));
      await route.continue();
    });
    await delayed.locator('[data-theatre-launch]').click();
    await delayed.keyboard.press('PageDown');
    await delayed.waitForTimeout(900);
    assert.equal(await delayed.locator(stage).count(), 0, 'Takeover must cancel a pending launch');
    await close(delayed);

    const unavailable = await page();
    await unavailable.route(/\/theatre\/theatre\.js(?:\?.*)?$/, route => route.abort('failed'));
    await unavailable.locator('[data-theatre-launch]').click();
    await unavailable.locator('[data-theatre-loading]').filter({ hasText: 'could not load' }).waitFor();
    assert.equal(await unavailable.locator(stage).count(), 0);
    assert.equal(await unavailable.locator('[data-theatre-launch]').getAttribute('aria-busy'), null);
    await close(unavailable);

    const audioFailure = await page();
    if (await audioFailure.evaluate(() => Boolean(window.AudioContext || window.webkitAudioContext))) {
      let releaseResponse;
      const gate = new Promise(resolve => { releaseResponse = resolve; });
      await audioFailure.route(/\/soundtrack\.mp3(?:\?.*)?$/, async route => {
        await gate;
        await route.fulfill({ status: 404, body: 'Unavailable for regression check' });
      });
      await launch(audioFailure);
      await audioFailure.locator(control('sound')).focus();
      releaseResponse();
      await audioFailure.waitForFunction(() => document.querySelector('[data-action="sound"]')?.disabled);
      assert.equal(await audioFailure.locator(control('sound')).getAttribute('aria-pressed'), 'false');
      assert.equal(await audioFailure.locator(control('pause')).evaluate(element => element === document.activeElement), true,
        'Disabling failed audio must preserve keyboard focus');
    }
    await close(audioFailure);
    assert.deepEqual(errors, [], 'No uncaught application errors');
    console.log('PASS: cancelled preparation, unavailable module and no uncaught errors');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });

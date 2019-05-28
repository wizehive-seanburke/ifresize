import {Selector} from "testcafe"

let initialDims = {}
let newDims = {}

const removePx = (string) => {
    return parseInt(string, 10)
}

async function getIframeSize() {
    console.log("In getIframeSize")
    let height = await getIframeHeight()
    let width = await getIframeWidth()
    return {"height": height, "width": width,}
}

async function getIframeHeight() {
    let height = Selector('#target')
    return removePx(await height.getStyleProperty("height"))
}

async function getIframeWidth() {
    let width = Selector('#target')
    return removePx(await width.getStyleProperty("width"))
}

async function checkHeightChanged() {
    let height = await getIframeHeight()
    console.log({
        "height": height,
        "initialDims.height": initialDims.height
    })
    if (height > initialDims.height) {
        return true
    }
    return false
}

async function checkWidthChanged() {
    let width = await getIframeWidth()
    console.log({
        "width": width,
        "initialDims.width": initialDims.width
    })
    if (width > initialDims.width) {
        return true
    }
    return false
}

fixture `Test iFrame Resize`
    .page `http://localhost:1234/index.html`

test("Check Auto Resize", async t => {
    await t.wait(3000) //Wait for iframe to fully load
    initialDims = await getIframeSize()
    console.log(initialDims)
    await t.switchToIframe("#target")
        .click('#toggleBoxSize')
        .wait(1000)
        .switchToMainWindow()
    await t.expect(await checkHeightChanged()).ok()
        .expect(await checkWidthChanged()).ok()
})

test("Check turning off Auto Resize", async t => {
    await t.wait(3000)  //Wait for iframe to fully load
    initialDims = await getIframeSize()
    await t.switchToIframe('#target')
        .click('#autoToggle')
        .click('#toggleBoxSize')
        .wait(1000)
        .switchToMainWindow()
    await t.expect(await checkHeightChanged()).notOk()
        .expect(await checkWidthChanged()).notOk()
})

test("Check manual triggering of iframe resize", async t => {
    await t.wait(3000)  //Wait for iframe to fully load
    initialDims = await getIframeSize()
    await t.switchToIframe("#target")
        .click('#autoToggle')
        .click('#toggleBoxSize')
        .wait(1000)
        .switchToMainWindow()
    await t.expect(await checkHeightChanged()).notOk()
        .expect(await checkWidthChanged()).notOk()
    await t.switchToIframe("#target")
        .click('#updatePageSize')
        .wait(1000)
        .switchToMainWindow()
    await t.expect(await checkHeightChanged()).ok()
        .expect(await checkWidthChanged()).ok()
})

test("Check setting iframe size manually", async t => {
        await t.switchToIframe("#target")
            .typeText("#manualHeight", "400")
            .typeText("#manualWidth", "500")
            .click("#manualSizeTrigger")
            .switchToMainWindow()
            .wait(1000)
        await t.expect(await getIframeHeight()).eql(400)
            .expect(await getIframeWidth()).eql(500)
})

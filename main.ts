function DETECT_WATER () {
    istherewater = pins.digitalReadPin(DigitalPin.P1)
    if (istherewater == 1) {
        pins.digitalWritePin(DigitalPin.P13, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P13, 0)
    }
}
function variables () {
    HighTemp = 19
    HighHumidity = 50
    LightLevelLow = 800
    HighWaterTemp = 65
}
function Get_Temp_Data () {
    OLED.writeStringNewLine("Getting data. wait...")
    dht11_dht22.queryData(
    DHTtype.DHT22,
    DigitalPin.P0,
    true,
    false,
    true
    )
    AirTemp = dht11_dht22.readData(dataType.temperature)
    basic.pause(2000)
    humidity = dht11_dht22.readData(dataType.humidity)
    watertemp = dstemp.celsius(DigitalPin.P8)
}
function Fan_Control () {
    if (AirTemp > HighTemp) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        pins.digitalWritePin(DigitalPin.P16, 1)
    } else {
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
}
function Moisture () {
    let watermax = 0
    moistureReading = pins.analogReadPin(AnalogPin.P1)
    moisture = Math.map(moistureReading, 0, watermax, 0, 100)
    OLED.writeStringNewLine("Raw Ms")
    OLED.writeNumNewLine(moistureReading)
    OLED.writeStringNewLine("Scaled Ms=")
    OLED.writeNumNewLine(moisture)
    basic.pause(2000)
    basic.clearScreen()
    if (moisture <= 29) {
        OLED.writeStringNewLine("NEED WATER")
    } else if (moisture > 30 && moisture <= 65) {
        OLED.writeStringNewLine("Water = Good")
    } else {
        OLED.writeStringNewLine("Too Wet")
    }
}
function GetLightData () {
    lux = input.lightLevel() * 11
    lux += 90
}
function Light_Control () {
    if (lux < LightLevelLow) {
        pins.digitalWritePin(DigitalPin.P12, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P12, 0)
    }
}
function Show_Data () {
    OLED.clear()
    OLED.writeStringNewLine("AirTemp=")
    OLED.writeNumNewLine(AirTemp)
    OLED.writeStringNewLine("Humidity")
    OLED.writeNumNewLine(humidity)
    OLED.writeStringNewLine("WaterTemp=")
    OLED.writeNumNewLine(Math.round(watertemp))
    OLED.writeStringNewLine("Lux=")
    OLED.writeNum(lux)
    basic.pause(5000)
    OLED.clear()
}
let lux = 0
let moisture = 0
let moistureReading = 0
let watertemp = 0
let humidity = 0
let AirTemp = 0
let HighWaterTemp = 0
let LightLevelLow = 0
let HighHumidity = 0
let HighTemp = 0
let istherewater = 0
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P2, 30, NeoPixelMode.RGB)
OLED.init(128, 64)
basic.showIcon(IconNames.Happy)
basic.forever(function () {
    variables()
    Get_Temp_Data()
    GetLightData()
    DETECT_WATER()
    Show_Data()
    Light_Control()
    Fan_Control()
})

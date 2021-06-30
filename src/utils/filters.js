module.exports = {
    preco: preco => preco !== "-9999999999", 
    liquidez: liquidez => liquidez !== "-9999999999",
    DY_medio_12m: DY_medio_12m => DY_medio_12m !== "-9999999999" && DY_medio_12m !== "0.0",
    DY: DY => DY !== "N/A" && DY !== "0.0"
}
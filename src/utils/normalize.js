module.exports = {
    fii: {
        preco: preco => Number(preco),
        liquidez: liquidez => Number(Number(liquidez).toFixed()),
        DY: DY => Number( Number(DY).toFixed(2) ),
        DY_acum_12m: DY_acum_12m => Number( Number(DY_acum_12m).toFixed(2) ),
        DY_medio_12m: DY_medio_12m => Number( Number(DY_medio_12m).toFixed(2) ),
        P_VPA: P_VPA => Number( Number(P_VPA).toFixed(2) )
    },
    acoes: {}
}
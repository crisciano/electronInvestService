const normalize = require('../utils/normalize')


class Helpers {

    sortByKeyCres(array, key) {
        return array.sort((a, b) => {
            if (a[key] > b[key]) return 1;
            if (a[key] < b[key]) return -1;
            return 0;
        });
    }
    
    sortByKeyDesc(array, key) {
        return array.sort((a, b) => {
            if (a[key] < b[key]) return 1;
            if (a[key] > b[key]) return -1;
            return 0;
        });
    }

    median(values){
        if(values.length === 0) return 0;
      
        values.sort((a,b) => a-b );
      
        var half = Math.floor(values.length / 2);
      
        return (values.length % 2) ? values[half] : ((values[half - 1] + values[half]) / 2.0)
      }

    filterByKeys (list, keys) {
        return list.map(fii => {
            return Object.keys(fii)
                    .filter(key => keys.includes(key) )
                    .reduce( (obj, key) => {
                        obj[key]= fii[key]
                        return obj
                    }, {})
        })
    }

    normalize (type, list ) {
        return list.map(fii => {
            var obj = {}
            var keysFiis = Object.keys(fii)
            var values = keysFiis.map(key => typeof normalize[type][key] === "function" ? normalize[type][key](fii[key]) : fii[key]) 
            keysFiis.map((key, id )=> obj[key] = values[id]  )
            return obj
        })
    }
}

module.exports = new Helpers()
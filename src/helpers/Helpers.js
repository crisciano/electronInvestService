class Helpers {

    // sortByKeyDesc(array, key) {
    //     return array.sort((a, b) => a[key] - b[key] );
    // }
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
}

module.exports = new Helpers()
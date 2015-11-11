function getMessage(a, b) {

    if (typeof(a) == "boolean") {
        if (a == true) {
            return 'Я попал в ' + b;
        } else {
            return 'Я никуда не попал';
        }
    }

    if (typeof(a) == "number") {
        return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
    }

    if ( Array.isArray(a) && !Array.isArray(b)) {
        var sum = 0;
        var size = a.length;
        for (var i = 0; i < size; i++) {

            sum = sum + a[i];
        }
        return 'Я прошел ' + sum + ' шагов';
    }

    if ( Array.isArray(a) && Array.isArray(b)) {
        var length = 0;
        var summa = 0;
        var size = a.length;

        for (var i = 0; i < size; i++) {

            summa = a[i] * b[i];
            length = length + summa;
        }
        return 'Я прошел ' + length + ' метров';
    }
}

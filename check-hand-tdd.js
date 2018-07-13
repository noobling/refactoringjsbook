var wish = require('wish');
var deepEqual = require('deep-equal');

function valuesFromHand (hand) {
	return hand.map(function (val) {
		return val.split('-')[0]
	})
}

function highestCount (values) {
	var highest = 0;
	var currentHigh;
	for (var i = 0; i < values.length; i++) {
		currentHigh = 0
		for (var j = 0; j < values.length; j++) {
			if (values[i] === values[j]) {
				currentHigh++
			}
		}
		if (currentHigh > highest) highest = currentHigh
	}
	
	return highest;
}

var multiplesInHand = function (hand) {
	return highestCount(valuesFromHand(hand))
}

var isPair = function (hand) {
	return multiplesInHand(hand) === 2;
}

var checkHand = function (hand) {
	if (isPair(hand)) {
		return 'pair';
	} else {
		return 'three of a kind';
	}
}

describe('checkHand()', function () {
	it('handles pairs', function () {
		var result = checkHand(['2-H', '3-C', '4-D', '5-H', '2-C']);
		wish(result === 'pair');

		var anotherResult = checkHand(['3-H', '3-C', '4-D', '5-H', '2-C']);
        wish(anotherResult === 'pair');
	})

	it('handles three of a kind', function () {
		var result = checkHand(['3-H','3-C','3-D','5-H','2-H']);
		wish(result === 'three of a kind')
	})
})

describe('multiplesInHand()', function () {
	it('finds duplicates', function () {
		var result = multiplesInHand(['2-H', '3-C', '4-D', '5-H', '2-C'])
		wish(result == 2)
	})
})

describe('highestCount()', function () {
	it('returns the highest count from values', function () {
		var result = highestCount(['2', '2', '4', '4', '4'])
		wish(result === 3)

		result = highestCount(['2', '1', '6', '10', '4'])
		wish(result === 1)

		result = highestCount(['2', '1', '6', '10', '2'])
		wish(result === 2)
	})
})

describe('valuesFromHand()', function () {
	it('returns the values from hand', function () {
		var result = valuesFromHand(['2-H', '3-C', '4-D', '5-H', '2-C'])
		wish(deepEqual(result, ['2', '3', '4', '5', '2']))

		var result = valuesFromHand(['10-H', '3-C', '4-D', '5-H', '2-C'])
		wish(deepEqual(result, ['10', '3', '4', '5', '2']))
	})
})


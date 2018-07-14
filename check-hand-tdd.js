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

var countsFromSortedValues = function (sortedValues) {
	var counts = []
	var counted = []
	for (var i = 0; i < sortedValues.length; i++) {
		var count = 0
		if (counted.indexOf(sortedValues[i]) === -1) {
			for (var j = 0; j < sortedValues.length; j++) {
				if (sortedValues[i] === sortedValues[j]) {
					count++
				}
			}
			counted.push(sortedValues[i])
			counts.push(count)
		}
	}
	return counts.sort()
}

var multiplesInHand = function (hand) {
	return highestCount(valuesFromHand(hand))
}

var suitsFromHand = function (hand) {
	return hand.map(function (value) {
		return value.split('-')[1]
	})
}

var isAllSameSuit = function (suits) {
	for (var i = 0; i < suits.length; i++) {
		for (var j = 0; j < suits.length; j++) {
			if (suits[i] != suits[j]) return false
		}
	}

	return true
}

var sortValues = function (values) {
	return values.sort(function (a, b) {
		return parseInt(a) > parseInt(b)
	})
}

var fourAway = function (values) {
	if (Math.abs(parseInt(values[0]) - parseInt(values[values.length - 1])) === 4) {
		return true
	}
	return false
}

var noMultiples = function (values) {
	return highestCount(values) === 1;
}

var isPair = function (hand) {
	return multiplesInHand(hand) === 2;
}

var isTriple = function (hand) {
	return multiplesInHand(hand) === 3;
}

var isQuadruple = function (hand) {
	return multiplesInHand(hand) === 4;
}

var isFlush = function (hand) {
	return isAllSameSuit(suitsFromHand(hand))
}

var isStraight = function (hand) {
	var sortedValues = sortValues(valuesFromHand(hand))
	return fourAway(sortedValues) && noMultiples(valuesFromHand(hand))
}

var isStraightFlush = function (hand) {
	return isFlush(hand) && isStraight(hand)
}

var isFullHouse = function (hand) {
	var counts = countsFromSortedValues(sortValues(valuesFromHand(hand)))
	if (counts.indexOf(2) != -1 && counts.indexOf(3) != -1) {
		return true
	}
	return false
}

var isTwoPair = function (hand) {
	var counts = countsFromSortedValues(sortValues(valuesFromHand(hand)))
	if (counts[1] === 2 && counts[2] === 2) {
		return true
	}

	return false
}

var checkHand = function (hand) {
	if (isTwoPair(hand)) {
		return 'two pair'
	} else if (isPair(hand)) {
		return 'pair';
	} else if (isFullHouse(hand)) {
		return 'full house'
	} else if (isTriple(hand)) {
		return 'three of a kind';
	} else if (isQuadruple(hand)) {
		return 'four of a kind'
	} else if(isStraightFlush(hand)) {
		return 'straight flush'
	} else if (isFlush(hand)) {
		return 'flush'
	} else if (isStraight(hand)) {
		return 'straight'
	} else {
		return 'high card'
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

	it ('handles four of a kind', function () {
		var result = checkHand(['3-H','3-C','3-D','3-S','2-H'])
		wish(result === 'four of a kind')
	})

	it('handles high card', function () {
		var result = checkHand(['2-H', '5-C', '9-D', '7-S', '3-H'])
		wish(result === 'high card')
	})

	it('handles flush', function () {
		var result = checkHand(['2-H', '5-H', '9-H', '7-H', '3-H'])
		wish(result === 'flush')
	})

	it('handles straight', function () {
		var result = checkHand(['2-H', '3-S', '4-D', '5-C', '6-D'])
		wish(result === 'straight')
	})

	it('handles straight flush', function () {
		var result = checkHand(['1-H', '2-H', '3-H', '4-H', '5-H'])
		wish(result === 'straight flush')
	})

	it('handles full house', function () {
		var result = checkHand(['2-D', '2-H', '3-H', '3-D', '3-C'])
		wish(result === 'full house')
	})

	it('handles two pair', function () {
		var result = checkHand(['2-D', '2-H', '3-H', '3-D', '10-C'])
		wish(result === 'two pair')
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

describe('suitsFromHand()', function () {
	it('returns the suits from hand', function () {
		var result = suitsFromHand(['1-H', '2-H', '3-H', '4-H', '5-D'])
		wish(deepEqual(result, ['H', 'H', 'H', 'H', 'D']))
	})
})

describe('isAllSameSuit()', function () {
	it('returns all the same suit when all the same suit', function () {
		var result = isAllSameSuit(['D', 'D', 'D', 'D', 'D'])
		wish(result === true)
	})
})

describe('sortValues()', function () {
	it('sorts values', function () {
		var result = sortValues(['1', '10', '5', '6', '7'])
		wish(deepEqual(result, ['1', '5', '6', '7', '10']))
	})
})

describe('fourAway()', function () {
	it('returns if sorted values largest and smallest value has a difference of 4', function () {
		var result = fourAway(['1', '2', '3', '4', '5'])
		wish(result === true)

		result = fourAway(['1', '3', '5', '9', '10'])
		wish(result === false)

		result = fourAway(['4', '5', '6', '7', '8'])
		wish(result === true)
	})
})

describe('countsFromSortedValues()', function () {
	it('returns the counts for each value in the array of sorted values', function () {
		var result = countsFromSortedValues(['1', '2', '2', '3', '3'])
		wish(deepEqual(result, [1, 2, 2]))

		result = countsFromSortedValues(['1', '1', '3', '3', '3'])
		wish(deepEqual(result, [2, 3]))
	})

	it('returns the counts for each value of array in sorted order', function  () {
		var result = countsFromSortedValues(['1', '1', '2', '3', '3'])
		wish(deepEqual(result, [1, 2, 2]))
	})
})

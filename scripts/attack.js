import attackLookup from './../attackLookup.json'

export function attack(message) {
    let outMsg = `<div><h3 style='border-bottom: 3px solid black'>Attack</h3><div>`

    const CRITICAL_SUCCESS = 2
    const SUCCESS =     1
    const UNASSIGNED = 0
    const FAILURE =     -1
    const CRITICAL_FAILURE = -2

    game.user.targets.forEach(target => {
        let naturalRoll = message.roll.dice[0].rolls[0].roll
        let rollTotal = message.roll.total
        let actorAC = target.actor.data.data.attributes.ac.value

        let currentStep = UNASSIGNED

        if (naturalRoll != 20 && naturalRoll != 1) {
            if (rollTotal >= actorAC + 10) {
                currentStep = CRITICAL_SUCCESS
            } 
            else if (rollTotal >= actorAC) {
                currentStep = SUCCESS
            }
            else if (rollTotal <= actorAC - 10) {
                currentStep = CRITICAL_FAILURE
            }
            else {
                currentStep = FAILURE
            }
        }
        else {
            if (naturalRoll == 20) {
                currentStep += 1
            }
            else if (naturalRoll == 1) {
                currentStep -= 1
            }
        } 

        let finalResult = Math.clamp(currentStep, CRITICAL_FAILURE, CRITICAL_SUCCESS)

        let heroName = game.user.character
        let posHeroName = heroName
        if (heroName[heroName.length - 1] == 's') {
            posHeroName = heroName.substring(0, heroName.length)
        }

        let successBy = Math.clamp(rollTotal - actorAC, -10, 10)
        if (naturalRoll == 20) {
            successBy = successBy + 10
        }
        else if (naturalRoll == 1) {
            successBy = successBy - 10
        }

        let selectedMessage = null
        for (let regime of attackLookup) {
            if ( (regime.high == null || successBy <= regime.high) && (regime.low == null || successBy >= regime.low) ) {
                // Sum weights in regime
                let weightSum = 0
                for (let message of regime.messages) {
                    weightSum += message.weight
                }

                let randNum = Math.random()*weightSum
                for (let message of target.messages) {
                    if (randNum <= message.weight) {
                        selectedMessage = message.text

                        break
                    }
                    else {
                        randNum -= message.weight
                    }
                }

                break
            }
        }

    })
}
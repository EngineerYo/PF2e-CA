import {sendMessage} from './sendMessagae.js'
import attackLookup from './../attackLookup.json'


attackLookup = JSON.parse(attackLookup)

export function attack(message) {
    let outMsg = `<div><h3 style='border-bottom: 3px solid black'>Attack</h3><div>`

    const CRITICAL_SUCCESS = 1
    const SUCCESS =     0
    const FAILURE =     -1
    const CRITICAL_FAILURE = -2

    game.user.targets.forEach(target => {
        let naturalRoll = message.roll.dice[0].rolls[0].roll
        let rollTotal = message.roll.total
        let actorAC = target.actor.data.data.attributes.ac.value

        let currentStep = null

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


        outMsg += `<div class = 'targetPicker' data-target="${target.data._id}" data-hitType="cm">`
        outMsg += `<div style = "color: #131516; margin-top: 4px;"`
        outMsg += `<b>${target.name}</b>`
        outMsg += `</div>`
        outMsg += `<div style="border-bottom: 2px solid black; color: #131516; padding-bottom: 4px;">`
        if (currentStep == CRITICAL_SUCCESS) {
            outMsg += `<b style="color: #4C7D4C>`
            outMsg += `Critically hit! ${selectedMessage}`
            outMsg += `</b>`
        }
        else if (currentStep == SUCCESS) {
            outMsg += `Hit! ${selectedMessage}`
        }
        else if (currentStep == FAILURE) {
            outMsg += `Miss! ${selectedMessage}`
        }
        else if (currentStep == CRITICAL_FAILURE) {
            outMsg += `<b style="color: #990000>`
            outMsg += `Critically missed! ${selectedMessage}`
            outMsg += `</b>`
        }
        else {
            console.log(`currentStep out of bounds\t${currentStep}`)
        }

        outMsg += `</div>`
        outMsg += `</div>`
    })

    if (game.user.targets.size > 0) {
        let chatData = {
            user: game.user._id,
            content: outMsg
        }

        sendMessage(chatData)
    }
}
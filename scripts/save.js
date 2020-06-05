import {sendMessage} from './sendMessage.js'

export function attack(message) {
    let naturalRoll = message.roll.dice[0].rolls[0].roll
    let rollTotal = message.roll.total

    let outMsg = `<div style='border-bottom: 3px solid black; padding-right: 5px; margin-bottom: 0px;'>`
    outMsg += `<h3 style='margin-bottom: 0px; display: inline-block;'>Save</h3>`
    outMsg += `<h3 style='margin-bottom: 0px; float: right;'>${rollTotal}</h3>`
    outMsg += `</div>`

    const CRITICAL_SUCCESS = 1
    const SUCCESS =     0
    const FAILURE =     -1
    const CRITICAL_FAILURE = -2

    game.user.targets.forEach(target => {
        let actorAC = target.actor.data.data.attributes.ac.value

        let currentStep = null

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

        if (naturalRoll == 20) {
            currentStep += 1
        }
        else if (naturalRoll == 1) {
            currentStep -= 1
        }

        let finalResult = Math.clamp(currentStep, CRITICAL_FAILURE, CRITICAL_SUCCESS)
        console.log(`finalResult\t${finalResult}`)

        let heroName = game.user.character.name
        let posHeroName = heroName
        if (heroName[heroName.length - 1] == 's') {
            posHeroName += `'`
        }
        else {
            posHeroName += `'s`
        }

        let successBy = Math.clamp(rollTotal - actorAC, -10, 10)
        if (naturalRoll == 20) {
            successBy = successBy + 9
        }
        else if (naturalRoll == 1) {
            successBy = successBy - 9
        }

        let saveLookup = [
            {
                low:    null,
                high:   -10,
                color:  '#F4CCCC',
                messages: [
                    {weight: 10, text: ``}
                ]
            },
            {
                low:    -9,
                high:   -5,
                color:  '#F9CB9C',
                messages: [
                    {weight: 10, text: ``}
                ]
            },
            {
                low:    -4,
                high:   -1,
                color:  '#FFF2CC',
                messages: [
                    {weight: 10, text: ``}
                ]
            },
            {
                low:    0,
                high:   4,
                color:  '#D9EAD3',
                messages: [
                    {weight: 10, text: ``}
                ]
            },
            {
                low:    5,
                high:   9,
                color:  '#D0E0E3',
                messages: [
                    {weight: 10, text: ``}
                ]
            },
            {
                low:    10,
                high:   null,
                color:  '#C9DAF8',
                messages: [
                    {weight: 10, text: ``}
                ]
            }
        ]

        let targetRegime = null
        let selectedMessage = null

        for (let regime of attackLookup) {
            if ( (regime.high == null || successBy <= regime.high) && (regime.low == null || successBy >= regime.low) ) {
                targetRegime = regime
                
                // Sum weights in regime
                let weightSum = 0
                for (let message of regime.messages) {
                    weightSum += message.weight
                }

                let randNum = Math.random()*weightSum
                for (let message of regime.messages) {
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


        let textLookup = {
             '1':	'Critical success!',
             '0':	'Success!',
            '-1':	'Failure!',
            '-2':	'Critical failure!'
        }
        
        outMsg += `<div class = 'targetPicker' data-target="${target.data._id}" data-hitType="cm" style = "background-color: ${targetRegime.color}; padding-top: 4px; padding-bottom: 2px; padding-left: 5px; padding-right: 5px; border-bottom: 2px solid black;">`
        outMsg += `<div style = "color: #131516;">`
        outMsg += `<b style='display: inline-block'>${target.name}</b>`
        outMsg += `<b style='float: right'>${textLookup[finalResult]}</b>`
        outMsg += `</div>`
        outMsg += `<div style="color: #131516;">`

        if (finalResult === CRITICAL_SUCCESS) {
            console.log('Crit success')
            outMsg += `${selectedMessage}`
        }
        else if (finalResult === SUCCESS) {
            outMsg += `${selectedMessage}`
        }
        else if (finalResult === FAILURE) {
            outMsg += `${selectedMessage}`
        }
        else if (finalResult === CRITICAL_FAILURE) {
            outMsg += `${selectedMessage}`
        }
        else {
            console.log(`finalResult out of bounds\t${finalResult   }`)
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
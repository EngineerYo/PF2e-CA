import {sendMessage} from './sendMessage.js'

export function attack(message) {
    let naturalRoll = message.roll.dice[0].rolls[0].roll
    let rollTotal = message.roll.total

    let outMsg = `<div style='display: grid; grid-template-columns: 20% 80%; border-bottom: 3px solid black; padding-right: 5px; margin-bottom: 0px;'>`
    outMsg += `<h3 style='margin-bottom: 0px;'>Attack</h3>`
    outMsg += `<h3 class='roll-mod' data-result='${message.roll.result}' data-total='${message.roll.total}' style='margin-bottom: 0px; text-align: right;'>${message.roll.total}`
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

        let attackLookup = [
            {
                low:    null,
                high:   -10,
                color:  '#F4CCCC',
                messages: [
                    {weight: 10, text: `Is ${heroName} even trying?`},
                    {weight: 10, text: `A supreme disappointment.`},
                    {weight:  1, text: `Sad and noob!`},
                    {weight: 10, text: `I hope no one was watching that...`},
                    {weight:  1, text: `${heroName} has small peepee.`}
                ]
            },
            {
                low:    -9,
                high:   -5,
                color:  '#F9CB9C',
                messages: [
                    {weight: 10, text: `The attack falters against the foe's superior defenses.`},
                    {weight: 10, text: `${heroName} will have to try harder than that.`}
                ]
            },
            {
                low:    -4,
                high:   -1,
                color:  '#FFF2CC',
                messages: [
                    {weight: 10, text: `Heroes never miss, but sometimes their attacks are dodged. Like this one.`},
                    {weight: 10, text: `A near thing, but still a miss.`},
                    {weight: 10, text: `${heroName} narrowly misses their target.`}
                ]
            },
            {
                low:    0,
                high:   4,
                color:  '#D9EAD3',
                messages: [
                    {weight: 10, text: `${posHeroName} strike connects, but just barely.`},
                    {weight: 10, text: `A lucky hit, nothing more.`}
                ]
            },
            {
                low:    5,
                high:   9,
                color:  '#D0E0E3',
                messages: [
                    {weight: 10, text: `${posHeroName} strike was well placed.`},
                    {weight: 10, text: `Another solid hit by ${heroName}.`}
                ]
            },
            {
                low:    10,
                high:   null,
                color:  '#C9DAF8',
                messages: [
                    {weight: 10, text: `${heroName} makes a critical strike against their foe!`},
                    {weight: 10, text: `Mortality clarified in a single strike!`},
                    {weight: 10, text: `Decimated! Obliterated! Annhiliated!`},
                    {weight: 10, text: `Destruction awaits this one!`}
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
             '1':   'Critical hit!',
             '0':   'Hit!',
            '-1':   'Miss!',
            '-2':   'Critical miss!'
        }
        
        outMsg += `<div class = 'targetPicker' data-expanded=false data-target="${target.data._id}" style="overflow: hidden; background-color: ${targetRegime.color}; padding-top: 2px; padding-bottom: 2px; padding-left: 5px; padding-right: 5px; border-bottom: 2px solid black;">`
        outMsg += `<div style = "color: #131516; display: grid; grid-template-columns: 60% 40%;">`
        outMsg += `<b>${target.name}</b>`
        outMsg += `<b style='text-align: right;'>${textLookup[finalResult]}</b>`
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
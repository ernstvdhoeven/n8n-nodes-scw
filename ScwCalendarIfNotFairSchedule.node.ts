import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';


const DAY = 24 * 60 * 60 * 1000;

const CREDIT_PER_DAY = 100
const CREDIT_PER_FORK = 2
const CREDIT_PER_PAN = 10
const CREDIT_PER_DAY_ELEC = 5


function keep(element, index, array) {
    const allowedDaysPerParty = Math.floor(365/ element.json.newData.parties.publicKeys.length);

    let result = {}
    for (const res of element.json.newData.calendar.schedule) {
        if (res in result)
            result[res] += 1;
        else
            result[res] = 1;
    }

    for (const res in result)
        if (result[res] > allowedDaysPerParty)
            return true;

    return false;
}


export class ScwCalendarIfNotFairSchedule implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Calendar - If Parties Have More Than Their Share Of Days',
		name: 'scwCalendarIfNotFairSchedule',
		group: ['transform'],
		version: 1,
		description: 'Continues if one or more parties have more scheduled days than is allowed/fair.',
		defaults: {
			name: 'If Schedule Is Unfair',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State Change'],
        outputNames: ['State Change'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}
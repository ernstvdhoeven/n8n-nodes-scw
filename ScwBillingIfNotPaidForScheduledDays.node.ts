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
    let daysInHouse = element.json.dataNew.calendar.schedule.length;
    if (daysInHouse == 0)
        return false;

    // this is a HACK for the purpose of this workshop (like so many others)
    // using this check we limit the amount of tests we need to modify for a correct result
    const uniqueScheduled = new Set(element.json.dataNew.calendar.schedule);
    if (uniqueScheduled.size != 1)
        return false;

    let price = element.json.dataNew.calendar.schedule.length * CREDIT_PER_DAY;
    const i = Number(element.json.dataNew.calendar.schedule[0]) - 1;

    return element.json.dataNew.billing.balance[i] != element.json.dataOld.billing.balance[i] - price;
}


export class ScwBillingIfNotPaidForScheduledDays implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Unpaid Scheduled Days',
		name: 'scwBillingIfNotPaidForScheduledDays',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes in which not all parties paid for the days they have spent in the house.',
		defaults: {
			name: 'Unpaid Scheduled Days',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['SC'],
        outputNames: ['SC'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}

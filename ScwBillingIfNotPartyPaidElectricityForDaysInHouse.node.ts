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

    let i = Number(element.json.dataNew.calendar.schedule[daysInHouse - 1]) - 1;
    let totalPrice = element.json.dataNew.billing.electricityBills.reduce((acc, cur) => acc + cur.endDay - cur.startDay + 1, 0) * CREDIT_PER_DAY_ELEC;
    let ourPrice = daysInHouse * CREDIT_PER_DAY_ELEC;
    let combinedPrice = (totalPrice - ourPrice) / element.json.dataNew.billing.balance.length + ourPrice;

    return element.json.dataNew.billing.balance[index] != element.json.dataOld.billing.balance[index] - Math.round(combinedPrice);
}


export class ScwBillingIfNotPartyPaidElectricityForDaysInHouse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Unpaid Electricity Scheduled Days',
		name: 'scwBillingIfNotPartyPaidElectricityForDaysInHouse',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes in which parties that stayed in the house did not pay more for the electricity used those days.',
		defaults: {
			name: 'Unpaid Electricity Scheduled Days',
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

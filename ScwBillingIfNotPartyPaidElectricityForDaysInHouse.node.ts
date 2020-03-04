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
    let daysInHouse = element.json.newData.calendar.schedule.length;
    if (daysInHouse == 0)
        return false;

    let i = Number(element.json.newData.calendar.schedule[daysInHouse - 1]) - 1;
    let totalPrice = element.json.dataNew.billing.electricityBills.reduce((acc, cur) => acc + cur.endDay - cur.startDay + 1, 0) * CREDIT_PER_DAY_ELEC;
    let ourPrice = daysInHouse * CREDIT_PER_DAY_ELEC;
    let combinedPrice = (totalPrice - ourPrice) / element.json.dataNew.billing.balance.length + ourPrice;

    return element.json.newData.billing.balance[index] != element.json.oldData.billing.balance[index] - Math.round(combinedPrice);
}


export class ScwBillingIfNotPartyPaidElectricityForDaysInHouse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Billing - If Party Did Not Pay Electricity For Days In House',
		name: 'scwBillingIfNotPartyPaidElectricityForDaysInHouse',
		group: ['transform'],
		version: 1,
		description: 'Continues if parties that stayed in the house paid more for the electricity for those days.',
		defaults: {
			name: 'If Not Paid Electricity For Days In House',
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

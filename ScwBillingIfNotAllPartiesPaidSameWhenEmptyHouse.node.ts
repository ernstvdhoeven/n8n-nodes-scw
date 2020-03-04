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
    if (daysInHouse != 0)
        return false;

    let totalPrice = element.json.dataNew.billing.electricityBills.reduce((acc, cur) => acc + cur.endDay - cur.startDay + 1, 0) * CREDIT_PER_DAY_ELEC;
    let pricePerParty = totalPrice / element.json.dataNew.billing.balance.length;

    for (let i = 0; i < element.json.dataNew.billing.balance.length; i++)
        if (element.json.dataNew.billing.balance[i] != Math.round(element.json.dataOld.billing.balance[i] - pricePerParty))
            return true;

    return false;
}


export class ScwBillingIfNotAllPartiesPaidSameWhenEmptyHouse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Billing - If Not Electricity Cost Equally Divided Between Parties When House Is Empty',
		name: 'scwBillingIfNotAllPartiesPaidSameWhenEmptyHouse',
		group: ['transform'],
		version: 1,
		description: 'Continues if not all parties paid the same amount for electricity for days that the house was empty.',
		defaults: {
			name: 'If Not Electricity Cost Equally Divided',
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

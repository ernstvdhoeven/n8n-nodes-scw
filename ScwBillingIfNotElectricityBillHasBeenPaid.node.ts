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
    let price = element.json.dataNew.billing.electricityBills.reduce((acc, cur) => acc + cur.endDay - cur.startDay + 1, 0) * CREDIT_PER_DAY_ELEC;
    if (element.json.dataNew.billing.balance.reduce((acc, cur) => acc + cur, 0) ==
        element.json.dataOld.billing.balance.reduce((acc, cur) => acc + cur, 0) - price)
        return false;

    return true;
}


export class ScwBillingIfNotElectricityBillHasBeenPaid implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Electricity Bills Changed',
		name: 'scwBillingIfNotElectricityBillHasBeenPaid',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which electricity bills have been added/changed in the new state.',
		defaults: {
			name: 'Electricity Bills Changed',
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

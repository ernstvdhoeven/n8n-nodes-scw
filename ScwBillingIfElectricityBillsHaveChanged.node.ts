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
    if (element.json.dataNew.billing.electricityBills.length != element.json.dataOld.billing.electricityBills.length)
        return true;

    for (let i = 0; i < element.json.dataNew.billing.electricityBills.length; i++)
        if (element.json.dataNew.billing.electricityBills[i].startDay != element.json.dataOld.billing.electricityBills[i].startDay ||
            element.json.dataNew.billing.electricityBills[i].endDay != element.json.dataOld.billing.electricityBills[i].endDay)
            return true;

    return false;
}


export class ScwBillingIfElectricityBillsHaveChanged implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Electricity Bills Changed',
		name: 'scwBillingIfElectricityBillsHaveChanged',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which the electricity bills have changed between old and new states.',
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

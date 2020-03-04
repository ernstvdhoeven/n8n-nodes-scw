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
    if (element.json.dataNew.billing.balance.length != element.json.dataOld.billing.balance.length)
        return true;

    for (let i = 0; i < element.json.dataNew.billing.balance.length; i++)
        if (element.json.dataNew.billing.balance[i] != element.json.dataOld.billing.balance[i])
            return true;

    return false;
}


export class ScwBillingIfBalanceChanged implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Billing - If Balance Changed',
		name: 'scwBillingIfBalanceChanged',
		group: ['transform'],
		version: 1,
		description: 'Continues if the balance of any of the parties has changed in the current state.',
		defaults: {
			name: 'If Balance Changed',
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

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
    const oldTotalCost = element[0].json.dataOld.inventory.numberOfPans * CREDIT_PER_PAN + element[0].json.dataOld.inventory.numberOfForks * CREDIT_PER_FORK;
    const newTotalCost = element[0].json.dataNew.inventory.numberOfPans * CREDIT_PER_PAN + element[0].json.dataNew.inventory.numberOfForks * CREDIT_PER_FORK;

    if (oldTotalCost == newTotalCost)
        return false;

    if (Number(element[1].json) == -1)
        return false;

    if (element[0].json.dataOld.billing.balance[Number(element[1].json) - 1] ==
        element[0].json.dataNew.billing.balance[Number(element[1].json) - 1] + Math.max(0, oldTotalCost - newTotalCost))
        return false;

    return true;
}


export class ScwBillingIfNotPartyBilledNegativelyForMissingInventory implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Uncompensated Missing Inventory',
		name: 'scwBillingIfNotPartyBilledNegativelyForMissingInventory',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes, Party - Output: State Changes for which the last party (given as input) in the house has not been charged for missing inventory.',
		defaults: {
			name: 'Uncompensated Missing Inventory',
			color: '#772244',
		},
		inputs: ['main', 'main'],
        outputs: ['main'],
        inputNames: ['SC', 'Party'],
        outputNames: ['SC'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData(0);
        const lastParty = this.getInputData(1);

        const zippedData = itemsAll.map((k, i) => [k, lastParty[i]]);
        const resultZipped = zippedData.filter(keep);
        const result = resultZipped.map((k, i) => k[0]);
        
        return this.prepareOutputData(result);
	}
}

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
    if (element.json.dataNew.inventory.numberOfForks == element.json.dataOld.inventory.numberOfForks &&
        element.json.dataNew.inventory.numberOfPans == element.json.dataOld.inventory.numberOfPans)
        return false;

    return true;
}


export class ScwInventoryHasChanged implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Inventory Changed',
		name: 'scwInventoryHasChanged',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which the inventory has been changed in the current state.',
		defaults: {
			name: 'Inventory Changed',
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

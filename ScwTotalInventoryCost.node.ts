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


export class ScwTotalInventoryCost implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Get The Total Inventory Cost',
		name: 'scwTotalInventoryCost',
		group: ['transform'],
		version: 1,
		description: 'Outputs the total cost of all the inventory for a given input state.',
		defaults: {
			name: 'Get Total Inventory Cost',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State'],
        outputNames: ['Number'],
		properties: []
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = []

        for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++) {
            result.push({'json': (itemsAll[itemIndex].json.inventory['numberOfForks'] * CREDIT_PER_FORK +
                itemsAll[itemIndex].json.inventory['numberOfPans'] * CREDIT_PER_PAN)});
        }

		return this.prepareOutputData(result);
	}
}

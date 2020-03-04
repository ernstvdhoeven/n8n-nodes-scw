import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';


export class ScwFail implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Fail',
		name: 'scwFail',
		group: ['transform'],
		version: 1,
		description: 'Shows the smart contract tests that failed.',
		defaults: {
			name: 'Fail',
			color: '#772244',
		},
		inputs: ['main'],
		outputs: [],
		properties: []
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = []

        for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++) {
            if (itemsAll[itemIndex].json.shouldFail != itemsAll[itemIndex].json.hasFailed) {
                    result.push({'json': {'description': itemsAll[itemIndex].json.description}});
            }
        }

        return this.prepareOutputData(result);
	}
}

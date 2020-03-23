import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';


export class ScwGetOldState implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Get Old State',
		name: 'scwGetOldState',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State (only outputs the old state and not all state change data).',
		defaults: {
			name: 'Get Old State',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['SC'],
        outputNames: ['State'],
		properties: []
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = []

        for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++) {
            result.push({'json': itemsAll[itemIndex].json.dataOld});
        }

		return this.prepareOutputData(result);
	}
}

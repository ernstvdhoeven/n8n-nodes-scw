import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';


export class ScwGetNewState implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Get New State',
		name: 'scwGetNewState',
		group: ['transform'],
		version: 1,
		description: 'Only outputs the new state and not all state change data.',
		defaults: {
			name: 'Get New State',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State Change'],
        outputNames: ['State'],
		properties: []
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = []

        for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++) {
            result.push({'json': itemsAll[itemIndex].json.dataNew});
        }

		return this.prepareOutputData(result);
	}
}

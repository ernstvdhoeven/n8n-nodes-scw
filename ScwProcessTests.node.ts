import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';


export class ScwProcessTests implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Process Tests',
		name: 'scwProcessTests',
		group: ['transform'],
		version: 1,
		description: 'Processes all the smart contract test cases and shows the results.',
		defaults: {
			name: 'Process Tests',
			color: '#772244',
		},
        inputs: ['main', 'main'],
        outputs: ['main'],
        inputNames: ['All', 'Rejected'],
        outputNames: ['All'],
		properties: []
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData(0);
        const itemsRejected = this.getInputData(1);

		for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++) {
            for (let rejectedIndex = 0; rejectedIndex < itemsRejected.length; rejectedIndex++) {
                if (itemsAll[itemIndex].json.hasFailed) {
                    continue;
                }

                if (itemsAll[itemIndex].json.description != itemsRejected[rejectedIndex].json.description) {
                    continue;
                }

                itemsAll[itemIndex].json.hasFailed = true;
            }
        }

		return this.prepareOutputData(itemsAll);
	}
}

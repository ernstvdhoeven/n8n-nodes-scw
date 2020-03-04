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
        inputs: ['main'],
        outputs: ['main'],
        inputNames: ['Rejected'],
        outputNames: ['Results'],
		properties: []
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsRejected = this.getInputData();
        const staticData = this.getWorkflowStaticData('global');

		for (let itemIndex = 0; itemIndex < staticData['allTests'].length; itemIndex++) {
            for (let rejectedIndex = 0; rejectedIndex < itemsRejected.length; rejectedIndex++) {
                if (staticData['allTests'][itemIndex].json.hasFailed) {
                    continue;
                }

                if (staticData['allTests'][itemIndex].json.description != itemsRejected[rejectedIndex].json.description) {
                    continue;
                }

                staticData['allTests'][itemIndex].json.hasFailed = true;
            }
        }

        return this.prepareOutputData(staticData['allTests']);
	}
}

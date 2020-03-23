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


export class ScwPartiesGetNumberOfParties implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Get Number Of Parties',
		name: 'scwPartiesGetNumberOfParties',
		group: ['transform'],
		version: 1,
		description: 'Input: State - Output: Number (the number of parties in the input state).',
		defaults: {
			name: 'Get Number Of Parties',
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

        for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++)
            result.push({'json': itemsAll[itemIndex].json.parties['publicKeys'].length});

		return this.prepareOutputData(result);
	}
}

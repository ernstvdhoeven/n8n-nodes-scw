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


export class ScwTrustedPartySignatureGetSignature implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Get Trusted Party Signature',
		name: 'scwTrustedPartySignatureGetSignature',
		group: ['transform'],
		version: 1,
		description: 'Input: State - Output: Signature (the signature of the trusted party for a given input state).',
		defaults: {
			name: 'Get Trusted Party Signature',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State'],
        outputNames: ['Signature'],
		properties: []
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = []

        for (let itemIndex = 0; itemIndex < itemsAll.length; itemIndex++) {
            result.push({'json': itemsAll[itemIndex].json.trustedPartySignature});
        }

		return this.prepareOutputData(result);
	}
}

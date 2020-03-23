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
    return element.json.dataNew.trustedPartySignature.signature == "";
}


export class ScwTrustedPartySignatureHasNotSigned implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - No Trusted Party Signed',
		name: 'scwTrustedPartySignatureHasNotSigned',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which the Trusted Party has not signed the new state.',
		defaults: {
			name: 'No Trusted Party Signature',
			color: '#772244',
		},
		inputs: ['main', 'main'],
        outputs: ['main'],
        inputNames: ['SC'],
        outputNames: ['SC'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData(0);
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}

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
    return element[0].json.dataNew.trustedPartySignature.signature != element[1].json.signature;
}


export class ScwTrustedPartySignatureIsSame implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Trusted Party Signature - If Is Same As',
		name: 'scwTrustedPartySignatureIsSame',
		group: ['transform'],
		version: 1,
		description: 'Continues if the provided signature is the same as the trusted party signature of the new state.',
		defaults: {
			name: 'If Is Same As',
			color: '#772244',
		},
		inputs: ['main', 'main'],
        outputs: ['main'],
        inputNames: ['State Change', 'Signature'],
        outputNames: ['State Change'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData(0);
        const parties = this.getInputData(1);

        const zippedData = itemsAll.map((k, i) => [k, parties[i]]);
        const resultZipped = zippedData.filter(keep);
        const result = resultZipped.map((k, i) => k[0]);
        
        return this.prepareOutputData(result);
	}
}

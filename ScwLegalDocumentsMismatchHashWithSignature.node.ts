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
    for (const signature in element.json.dataNew.signatures.signatures)
        if (element.json.dataNew.legalDocuments.documentHashes.includes(signature))
            return false;

    return true;
}


export class ScwLegalDocumentsMismatchHashWithSignature implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Legal Documents - Hash/Signature Mismatch',
		name: 'scwLegalDocumentsMismatchHashWithSignature',
		group: ['transform'],
		version: 1,
		description: 'Continues if the hashes of legal documents mismatch with the signatures.',
		defaults: {
			name: 'If Legal Documents Hash/Signature Mismatch',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['State Change'],
        outputNames: ['State Change'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}

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
    return element.json.dataNew.legalDocuments.documentHashes.length !=
        element.json.dataNew.legalDocuments.documentHashes.filter(x => Number.isNaN(Number(x)));
}


export class ScwLegalDocumentsIncorrectFormatting implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw - Legal Documents Incorrectly Formatted',
		name: 'scwLegalDocumentsIncorrectFormatting',
		group: ['transform'],
		version: 1,
		description: 'Input: State Changes - Output: State Changes for which legal documents have been formatted incorrectly.',
		defaults: {
			name: 'Legal Documents Incorrectly Formatted',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        inputNames: ['SC'],
        outputNames: ['SC'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData();
        const result = itemsAll.filter(keep);
        
        return this.prepareOutputData(result);
	}
}

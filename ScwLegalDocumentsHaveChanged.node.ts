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
    if (element.json.dataNew.legalDocuments.documentHashes.length != element.json.dataOld.legalDocuments.documentHashes.length)
        return true;

    for (let i = 0; i < element.json.dataNew.legalDocuments.documentHashes.length; i++)
        if (element.json.dataNew.legalDocuments.documentHashes[i] != element.json.dataOld.legalDocuments.documentHashes[i])
            return true;

    return false;
}


export class ScwLegalDocumentsHaveChanged implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Legal Documents - If Have Changed',
		name: 'scwLegalDocumentsHaveChanged',
		group: ['transform'],
		version: 1,
		description: 'Continues if legal documents have been changed/added in the current state.',
		defaults: {
			name: 'If Legal Documents Changed',
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

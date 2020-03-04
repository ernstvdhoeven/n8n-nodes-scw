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
    return Array.from(new Set(element[0].json.newData.signatures.signatures)).length != element[1].json;
}


export class ScwSignaturesIncorrectNumberOfUniqueSignatures implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Signatures - Incorrect Number Of Unique Signatures',
		name: 'scwSignaturesIncorrectNumberUniqueOfSignatures',
		group: ['transform'],
		version: 1,
		description: 'Continues if the number of unique signatures in the new state does not match the expected number (given as input).',
		defaults: {
			name: 'Incorrect Number Of Unique Signatures',
			color: '#772244',
		},
		inputs: ['main', 'main'],
        outputs: ['main'],
        inputNames: ['State Change', 'Number'],
		properties: []
    };


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        const itemsAll = this.getInputData(0);
        const numbers = this.getInputData(1);

        const zippedData = itemsAll.map((k, i) => [k, numbers[i]]);
        const resultZipped = zippedData.filter(keep);
        const result = resultZipped.map((k, i) => k[0]);
        
        return this.prepareOutputData(result);
	}
}

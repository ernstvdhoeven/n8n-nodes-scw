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
    const allSignatures = new Set(element[0].json.dataNew.signatures.signatures);
    for (let i = 0; i < element[1].json.length; i++)
        if (!allSignatures.has('s' + element[1].json[i]))
            return true;

    return false;
}


export class ScwSignaturesNotAllPartiesSigned implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw Signatures - Not All Parties Signed',
		name: 'scwSignaturesNotAllPartiesSigned',
		group: ['transform'],
		version: 1,
		description: 'Continues if not all the parties provided as input signed the new state.',
		defaults: {
			name: 'Not All Parties Signed',
			color: '#772244',
		},
		inputs: ['main', 'main'],
        outputs: ['main'],
        inputNames: ['State Change', 'Parties'],
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

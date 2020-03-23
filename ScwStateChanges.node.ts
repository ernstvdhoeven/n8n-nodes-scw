import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

function Parties({ publicKeys = ['1', '2', '3', '4', '5'] } = {}) {
  this.publicKeys = publicKeys;
}

function TrustedParty({ publicKey = 'pktp' } = {}) {
  this.publicKey = publicKey;
}

function Calendar({ schedule = [], requests = [] } = {}) {
  this.schedule = schedule;
  this.requests = requests;
}

function Inventory({ numberOfForks = 10, numberOfPans = 3 } = {}) {
  this.numberOfForks = numberOfForks;
  this.numberOfPans = numberOfPans;
}

function Billing({ balance = [1000, 1500, 500, 2240, 2000], electricityBills = [] } = {}) {
  this.balance = balance;
  this.electricityBills = electricityBills;
}

function LegalDocuments({ documentHashes = [] } = {}) {
  this.documentHashes = documentHashes;
}

function Signatures({ signatures = ['s1', 's2', 's3', 's4', 's5'] } = {}) {
  this.signatures = signatures;
}

function TrustedPartySignature({ signature = '' } = {}) {
  this.signature = signature;
}

function SmartContractData({
  parties = new Parties(),
  trustedParty = new TrustedParty(),
  calendar = new Calendar(),
  inventory = new Inventory(),
  billing = new Billing(),
  legalDocuments = new LegalDocuments(),
  signatures = new Signatures(),
  trustedPartySignature = new TrustedPartySignature(),
} = {}) {
  this.parties = parties;
  this.trustedParty = trustedParty;
  this.calendar = calendar;
  this.inventory = inventory;
  this.billing = billing;
  this.legalDocuments = legalDocuments;
  this.signatures = signatures;
  this.trustedPartySignature = trustedPartySignature;
}

function ReservationRequest({ startDate = new Date(), endDate = new Date(), identity = '' } = {}) {
  this.startDate = startDate;
  this.endDate = endDate;
  this.identity = identity;
}

function ElectricityBill({ startDay = 0, endDay = 0 } = {}) {
  this.startDay = startDay;
  this.endDay = endDay;
}

const DAY = 24 * 60 * 60 * 1000;

// timeslots should become available for everyone at the same time
const tests = [];
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    parties: new Parties({ publicKeys: ['1', '2', '3'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5'] }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'changing the contract parties should be possible when all parties sign',
  category: 'parties',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    parties: new Parties({ publicKeys: ['1', '2', '3'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'changing the contract parties requires signatures from all existing contract parties',
  category: 'parties',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    parties: new Parties({ publicKeys: ['1', '2', '3', '5'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5', 's3'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'changing the contract parties requires exactly one signature per contract party',
  category: 'parties',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    parties: new Parties({ publicKeys: ['1', '2', '3', '4', '5', '6'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5', 's6'] }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'adding a contract party should be possible if all parties sign the new state',
  category: 'parties',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    parties: new Parties({ publicKeys: ['1', '2', '3', '4', '5', '2'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5', 's2'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'an added party to the contract should not be be a participant already',
  category: 'parties',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    parties: new Parties({ publicKeys: ['1', '2', '3', '4', '5', '6'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'an added party to the contract should also provide a signature',
  category: 'parties',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    parties: new Parties({ publicKeys: ['1', '2', '3', '4', '5', 'a'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5', 'sa'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'the identity of a new party should be a public key',
  category: 'parties',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({
      requests: [new ReservationRequest({
        startDate: new Date(new Date().getTime() + 200 * DAY),
        endDate: new Date(new Date().getTime() + 214 * DAY),
        identity: '1',
      })],
    }),
    signatures: new Signatures({ signatures: ['s1'] }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'adding a time slot request should be possible for yourself if it has become available',
  category: 'booking',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({
      requests: [new ReservationRequest({
        startDate: new Date(new Date().getTime() + 370 * DAY),
        endDate: new Date(new Date().getTime() + 384 * DAY),
        identity: '1',
      })],
    }),
    signatures: new Signatures({ signatures: ['s1'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'adding a time slot request can not be done before a date is available (not more than a year in advance)',
  category: 'booking',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({
      requests: [new ReservationRequest({
        startDate: new Date(new Date().getTime() + DAY * 14),
        endDate: new Date(new Date().getTime() + DAY * 28),
        identity: '1',
      })],
    }),
    signatures: new Signatures({ signatures: ['s2'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'adding a time slot request can only be done on your own behalf',
  category: 'booking',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({
      requests: [new ReservationRequest({
        startDate: new Date(new Date().getTime() + DAY * 14),
        endDate: new Date(new Date().getTime() + DAY * 18),
        identity: '3',
      })],
    }),
    signatures: new Signatures({ signatures: ['s3'] }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'you should be able to add reservation requests for yourself if you have enough credit and are below your yearly limit (365 / number of parties)',
  category: 'booking',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({
      requests: [new ReservationRequest({
        startDate: new Date(new Date().getTime() + DAY * 14),
        endDate: new Date(new Date().getTime() + DAY * 28),
        identity: '3',
      })],
    }),
    signatures: new Signatures({ signatures: ['s3'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'you should have enough credits to pay for the days you reserve',
  category: 'booking',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({ schedule: [' '].concat(Array.from('1'.repeat(75))) }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'you can not get assigned more than your share of the days',
  category: 'booking',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({ schedule: ['1', '1', '1', ' ', '2', '2', '2'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'the house should be schedulable if there is a day for the trusted party to check the house',
  category: 'trusted party',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({ schedule: ['1', '1', '1', '2', '2', '2'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'there should be a day for the trusted party to check the house before it is reserved again',
  category: 'trusted party',
});

const startDateCustom = new Date(new Date().getTime() + 14 * DAY);
const endDateCustom = new Date(new Date().getTime() + 28 * DAY);

const dataOldCustom = new SmartContractData({
  calendar: new Calendar({
    requests: [
      new ReservationRequest({ startDate: startDateCustom, endDate: endDateCustom, identity: '4' }),
      new ReservationRequest({ startDate: startDateCustom, endDate: endDateCustom, identity: '1' })],
  }),
  signatures: new Signatures({ signatures: ['s1', 's4'] }),
});
const dataCorrectNewCustom = Object.assign({}, dataOldCustom);
const dataCorrectNewCalenderCustom = Object.assign({}, dataOldCustom.calendar);
dataCorrectNewCustom.calendar = dataCorrectNewCalenderCustom;
dataCorrectNewCustom.calendar.schedule = [' '].concat(Array.from('4'.repeat(7)));
tests.push({
    dataOld: dataOldCustom,
    dataNew: dataCorrectNewCustom,
    shouldFail: false,
    hasFailed: false,
    description: 'if a party has been randomly scheduled for the house to resolve overlapping reservation requests than this should be allowed',
    category: 'booking',
  });
const dataNewCustom = Object.assign({}, dataOldCustom);
const dataNewCalenderCustom = Object.assign({}, dataOldCustom.calendar);
dataNewCustom.calendar = dataNewCalenderCustom;
dataNewCustom.calendar.schedule = [' '].concat(Array.from('1'.repeat(7)));
tests.push({
  dataOld: dataOldCustom,
  dataNew: dataNewCustom,
  shouldFail: true,
  hasFailed: false,
  description: 'when multiple parties request the same day assign at random based on previous state hash',
  category: 'booking',
});

tests.push({
    dataOld: new SmartContractData(),
    dataNew: new SmartContractData({
      inventory: new Inventory({ numberOfForks: 10, numberOfPans: 2 }),
      billing: new Billing({ balance: [990, 1500, 500, 2240, 2000] }),
      trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
      calendar: new Calendar({ schedule: ['2', ' ', '1', '1'] }),
    }),
    shouldFail: false,
    hasFailed: false,
    description: 'missing inventory is allowed if the last party to stay in the house has seen an appropriate reduction in its credit',
    category: 'inventory',
  });
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    inventory: new Inventory({ numberOfForks: 10, numberOfPans: 2 }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
    calendar: new Calendar({ schedule: ['2', ' ', '1', '1'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'reductions in inventory should be compensated for by a deduction in participant credit',
  category: 'inventory',
});

tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({
      requests: [new ReservationRequest({
        startDate: new Date(new Date().getTime() + 14 * DAY),
        endDate: new Date(new Date().getTime() + 19 * DAY),
        identity: '3',
      })],
    }),
    signatures: new Signatures({ signatures: ['s3'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'you should have enough credits after a reservation to pay for missing inventory',
  category: 'inventory',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    billing: new Billing({ balance: [1000, 1000, 1000, 1000, 1000] }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'the trusted party is allowed to make changes to participants credits',
  category: 'trusted party',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    billing: new Billing({ balance: [1000, 1000, 1000, 1000, 1000] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'only the trusted party is allowed to make changes to participants credits',
  category: 'trusted party',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    billing: new Billing({ balance: [970, 1470, 470, 2210, 1970], electricityBills: new ElectricityBill({ startDay: 91, endDay: 120 }) }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'the trusted party can add bills to the list of bills',
  category: 'trusted party',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    billing: new Billing({ balance: [970, 1470, 470, 2210, 1970], electricityBills: new ElectricityBill({ startDay: 91, endDay: 120 }) }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'only the trusted party can add bills to the list of bills',
  category: 'trusted party',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({ schedule: ['4', '4', '4', '4', '4'] }),
    billing: new Billing({ balance: [975, 1475, 475, 2190, 1975], electricityBills: new ElectricityBill({ startDay: 1, endDay: 30 }) }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'electricity bills are accepted if they if the appropriate of credit is substracted from the relevant parties',
  category: 'billing',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    billing: new Billing({ electricityBills: new ElectricityBill({ startDay: 1, endDay: 30 }) }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'electricity bills have to be paid',
  category: 'billing',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({ schedule: ['4', '4', '4', '4', '4'] }),
    billing: new Billing({
      balance: [970, 1470, 470, 2210, 1970],
      electricityBills: new ElectricityBill({ startDay: 1, endDay: 30 }),
    }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'participants that reserved the house for days pay more of the electricity bill for that period',
  category: 'billing',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    billing: new Billing({
      balance: [970, 1470, 470, 2200, 1980],
      electricityBills: new ElectricityBill({ startDay: 1, endDay: 30 }),
    }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'electricity bills are during non reserved days split between all participants',
  category: 'billing',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({ schedule: Array.from('1'.repeat(12)) }),
    billing: new Billing({ balance: [-200, 1450, 450, 2190, 1950] }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'a party is allowed to have negative credit if the other parties compensate for that',
  category: 'billing',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({ schedule: Array.from('1'.repeat(12)) }),
    billing: new Billing({ balance: [0, 1450, 450, 2190, 1750] }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'participants should get negative credit if they do not have enough to pay',
  category: 'billing',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    calendar: new Calendar({ schedule: Array.from('1'.repeat(12)) }),
    billing: new Billing({ balance: [-200, 1500, 500, 2240, 2000] }),
    trustedPartySignature: new TrustedPartySignature({ signature: 'stp' }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'all other participants should temporarily cover for missing credit from other participants',
  category: 'billing',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    trustedParty: new TrustedParty({ publicKey: 'tp2' }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5'] }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'the identity of the trusted party can change is all parties sign for it',
  category: 'trusted party',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    trustedParty: new TrustedParty({ publicKey: 'tp2' }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'the identity of the trusted party can only change if all the participants agree',
  category: 'trusted party',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    legalDocuments: new LegalDocuments({ documentHashes: ['123123'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5'] }),
  }),
  shouldFail: false,
  hasFailed: false,
  description: 'a legal document can be added if all parties sign for it',
  category: 'legal documents',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    legalDocuments: new LegalDocuments({ documentHashes: ['123123'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's4', 's5'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'adding a legal document requires a signature from all the participants',
  category: 'legal documents',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    legalDocuments: new LegalDocuments({ documentHashes: ['h2'] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'the hash of the legal document should be properly formatted',
  category: 'legal documents',
});

// Advanced Tests
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    parties: new Parties({ publicKeys: ['1', '2', '3', '4', '5', '5='] }),
    signatures: new Signatures({ signatures: ['s1', 's2', 's3', 's4', 's5', 's5='] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'same public key found multiple times in participant list',
  category: 'misc',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    inventory: new Inventory({ numberOfForks: 20, numberOfPans: 10 }),
    billing: new Billing({ balance: [1090, 1500, 500, 2240, 2000] }),
    signatures: new Signatures({ signatures: ['s1'] }),
    calendar: new Calendar({ schedule: ['2', '1', '1'] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'adding inventory should not result in rewarding the participant with credit',
  category: 'misc',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({
    billing: new Billing({ balance: [1000, 1500, 500, 2240, 3000] }),
  }),
  shouldFail: true,
  hasFailed: false,
  description: 'participant five should not be able to add money to his balance',
  category: 'misc',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({}),
  shouldFail: true,
  hasFailed: false,
  description: 'participant should not always be selected at random',
  category: 'misc',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({}),
  shouldFail: true,
  hasFailed: false,
  description: 'the agreed upon legal document should be validated',
  category: 'misc',
});
tests.push({
  dataOld: new SmartContractData(),
  dataNew: new SmartContractData({}),
  shouldFail: true,
  hasFailed: false,
  description: 'participants should not be able to get an extra day on top of their share',
  category: 'misc',
});

export class ScwStateChanges implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scw System - State Changes',
		name: 'scwStateChanges',
		group: ['transform'],
		version: 1,
		description: 'All the input test cases for the smart contract, that need to be handled properly.',
		defaults: {
			name: 'State Changes',
			color: '#772244',
		},
		inputs: ['main'],
        outputs: ['main'],
        outputNames: ['SC'],
		properties: [
            {
				displayName: 'parties',
				name: 'parties',
				type: 'boolean',
				default: false,
            },
            {
                displayName: 'booking',
                name: 'booking',
                type: 'boolean',
                default: false,
            },
            {
				displayName: 'billing',
				name: 'billing',
				type: 'boolean',
				default: false,
            },
            {
				displayName: 'trusted party',
				name: 'trusted party',
				type: 'boolean',
				default: false,
            },
            {
				displayName: 'inventory',
				name: 'inventory',
				type: 'boolean',
				default: false,
            },
            {
				displayName: 'legal documents',
				name: 'legal documents',
				type: 'boolean',
				default: false,
            },
            {
				displayName: 'misc',
				name: 'misc',
				type: 'boolean',
				default: false,
            },
        ]
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const staticData = this.getWorkflowStaticData('global');

        let items = [];
        let staticItems = [];
        for (let testIndex = 0; testIndex < tests.length; testIndex++) {
            if (!this.getNodeParameter(tests[testIndex].category, 0) as boolean)
                continue;

            items.push({'json': tests[testIndex]});
            staticItems.push({'json': tests[testIndex]});
        }

        staticData.allTests = staticItems;
		return this.prepareOutputData(items);
	}
}

import { ContractAdminContract, ContractLifecycleStage, ContractRequiredDocumentConfig, ProjectDocument } from '../types';

export const defaultContractRequiredDocs: ContractRequiredDocumentConfig[] = [
  // Stage 1: Tendering & Bidding
  {
    id: 'req_tender_invitation',
    stage: 'Tendering & Bidding',
    category: 'Legal & Contract',
    title: 'Invitation to Tender (ITT) / Bid Notice',
    isRequired: true,
    description: 'Official tender announcement, prequalification notice, or selective bid invitation from client.'
  },
  {
    id: 'req_tender_submission',
    stage: 'Tendering & Bidding',
    category: 'Specification',
    title: 'Priced BOQ & Tender Submission Dossier',
    isRequired: true,
    description: 'Full commercial bid submission, priced bills of quantities, method statements, and technical proposal.'
  },
  {
    id: 'req_tender_bond',
    stage: 'Tendering & Bidding',
    category: 'Financial / Invoicing',
    title: 'Tender Bond / Bid Guarantee (Bank Guarantee)',
    isRequired: false,
    description: 'Statutory bid security issued by an approved commercial bank.'
  },

  // Stage 2: Evaluation & Award
  {
    id: 'req_bid_evaluation',
    stage: 'Evaluation & Award',
    category: 'Legal & Contract',
    title: 'Tender Evaluation & Negotiation Report',
    isRequired: false,
    description: 'Minutes of tender analysis, comparative bid appraisal, and technical evaluation.'
  },
  {
    id: 'req_award_letter',
    stage: 'Evaluation & Award',
    category: 'Legal & Contract',
    title: 'Formal Letter of Award / Letter of Acceptance',
    isRequired: true,
    description: 'Binding letter from the Employer/Client officially awarding the civil works contract.'
  },
  {
    id: 'req_performance_bond',
    stage: 'Evaluation & Award',
    category: 'Financial / Invoicing',
    title: 'Performance Bond (10% Contract Sum)',
    isRequired: true,
    description: 'Unconditional bank guarantee or surety bond securing performance under FIDIC Clause 4.2.'
  },

  // Stage 3: Execution & Administration
  {
    id: 'req_signed_contract',
    stage: 'Execution & Administration',
    category: 'Legal & Contract',
    title: 'Executed FIDIC Contract Agreement & Appendices',
    isRequired: true,
    description: 'Signed Red/Yellow Book formal deed of agreement, special provisions, and general conditions.'
  },
  {
    id: 'req_commencement_notice',
    stage: 'Execution & Administration',
    category: 'Legal & Contract',
    title: 'Engineer Commencement Order / Site Possession Notice',
    isRequired: true,
    description: 'Written instruction under FIDIC Clause 8.1 specifying the formal Commencement Date.'
  },
  {
    id: 'req_advance_guarantee',
    stage: 'Execution & Administration',
    category: 'Financial / Invoicing',
    title: 'Advance Payment Guarantee & Mobilization Receipt',
    isRequired: false,
    description: 'Bank guarantee securing the 15-20% advance mobilization disbursement.'
  },

  // Stage 4: Variations & Claims
  {
    id: 'req_variation_instruction',
    stage: 'Variations & Claims',
    category: 'Legal & Contract',
    title: 'Engineer Variation Instruction (EVI) & Cost Evaluation',
    isRequired: false,
    description: 'Formal written variation orders instructing scope additions, omissions, or rate revisions.'
  },
  {
    id: 'req_claim_notice',
    stage: 'Variations & Claims',
    category: 'Legal & Contract',
    title: 'Contractor Notice of Claim (FIDIC Clause 20.1)',
    isRequired: false,
    description: 'Formal 28-day statutory notice for unforeseen physical conditions, delays, or additional compensation.'
  },

  // Stage 5: Completion & Closeout
  {
    id: 'req_interim_certificates',
    stage: 'Completion & Closeout',
    category: 'Financial / Invoicing',
    title: 'Interim Payment Certificates (IPC Summary)',
    isRequired: true,
    description: 'Approved progress billing claims certified by the Supervising Consulting Engineer.'
  },
  {
    id: 'req_taking_over',
    stage: 'Completion & Closeout',
    category: 'Compliance / Permit',
    title: 'Taking-Over / Substantial Completion Certificate',
    isRequired: true,
    description: 'Official certificate under FIDIC Clause 10 verifying that the works are substantially complete.'
  },
  {
    id: 'req_as_builts',
    stage: 'Completion & Closeout',
    category: 'Architectural',
    title: 'Certified As-Built Engineering Drawings',
    isRequired: true,
    description: 'Comprehensive drawings reflecting actual physical construction as executed on site.'
  },
  {
    id: 'req_final_certificate',
    stage: 'Completion & Closeout',
    category: 'Financial / Invoicing',
    title: 'Final Payment Certificate & Discharge Statement',
    isRequired: false,
    description: 'Final closure of retention monies, claims settlement, and release of performance security.'
  }
];

export const contractDocumentService = {
  getRequiredDocsForStage: (stage: ContractLifecycleStage): ContractRequiredDocumentConfig[] => {
    return defaultContractRequiredDocs.filter(d => d.stage === stage);
  },

  getAllConfiguredRequirements: (): ContractRequiredDocumentConfig[] => {
    return defaultContractRequiredDocs;
  },

  getContractStage: (contract: ContractAdminContract): ContractLifecycleStage => {
    if (contract.currentStage) return contract.currentStage;
    switch (contract.status) {
      case 'opportunity':
      case 'tendering':
        return 'Tendering & Bidding';
      case 'under_evaluation':
      case 'awarded':
        return 'Evaluation & Award';
      case 'active':
        return 'Execution & Administration';
      case 'completed':
        return 'Completion & Closeout';
      default:
        return 'Execution & Administration';
    }
  },

  getContractDocuments: (contractId: number, allDocuments: ProjectDocument[]): ProjectDocument[] => {
    return allDocuments.filter(d => 
      (d.relatedType === 'Contract' && d.relatedId === contractId) ||
      d.category === 'Contract' ||
      d.category === 'Legal & Contract'
    );
  },

  analyzeMissingDocuments: (
    contract: ContractAdminContract,
    allDocuments: ProjectDocument[]
  ): {
    currentStage: ContractLifecycleStage;
    attachedCount: number;
    requiredDocs: ContractRequiredDocumentConfig[];
    missingRequiredDocs: ContractRequiredDocumentConfig[];
    completedDocs: ContractRequiredDocumentConfig[];
  } => {
    const currentStage = contractDocumentService.getContractStage(contract);
    const contractDocs = allDocuments.filter(d => 
      (d.relatedType === 'Contract' && d.relatedId === contract.id) ||
      (d.referenceNumber && d.referenceNumber === contract.contractNumber)
    );

    const stageRequirements = defaultContractRequiredDocs.filter(
      r => r.stage === currentStage && r.isRequired
    );

    const missingRequiredDocs: ContractRequiredDocumentConfig[] = [];
    const completedDocs: ContractRequiredDocumentConfig[] = [];

    stageRequirements.forEach(req => {
      const isPresent = contractDocs.some(doc => {
        const titleMatch = doc.title.toLowerCase().includes(req.title.toLowerCase().slice(0, 15));
        const catMatch = doc.category.toLowerCase().includes(req.category.toLowerCase());
        const descMatch = (doc.description || '').toLowerCase().includes(req.title.toLowerCase().slice(0, 15));
        return titleMatch || (catMatch && descMatch);
      });

      if (isPresent) {
        completedDocs.push(req);
      } else {
        missingRequiredDocs.push(req);
      }
    });

    return {
      currentStage,
      attachedCount: contractDocs.length,
      requiredDocs: stageRequirements,
      missingRequiredDocs,
      completedDocs
    };
  }
};

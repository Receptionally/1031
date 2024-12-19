import { supabase } from '../config/supabase';
import { logger } from '../services/utils/logger';

interface StateRule {
  state_code: string;
  state_name: string;
  allows_import: boolean;
  allows_export: boolean;
  allowed_import_states: string[];
  allowed_export_states: string[];
  requires_certification: boolean;
  certification_details: string | null;
  additional_requirements: string | null;
  max_transport_miles: number | null;
  requires_certification_beyond_miles: boolean;
  certification_miles_threshold: number | null;
}

interface TransportCheck {
  allowed: boolean;
  reason?: string;
  requirements?: string[];
}

export async function canTransportBetweenStates(
  originState: string,
  destinationState: string,
  distanceMiles?: number
): Promise<TransportCheck> {
  try {
    // Get rules for both states
    const { data: rules, error } = await supabase
      .from('state_rules')
      .select('*')
      .in('state_code', [originState, destinationState]);

    if (error) throw error;

    const originRule = rules.find(r => r.state_code === originState);
    const destRule = rules.find(r => r.state_code === destinationState);

    if (!originRule || !destRule) {
      logger.warn('Missing state rules:', { originState, destinationState });
      return { allowed: true }; // Default to allowed if rules not found
    }

    // Check if export is allowed from origin state
    if (!originRule.allows_export) {
      return { 
        allowed: false, 
        reason: `${originRule.state_name} does not allow firewood export` 
      };
    }

    // Check if import is allowed to destination state
    if (!destRule.allows_import) {
      return { 
        allowed: false, 
        reason: `${destRule.state_name} does not allow firewood import` 
      };
    }

    // If states specifically restrict transport between each other
    if (originRule.allowed_export_states?.length > 0 && 
        !originRule.allowed_export_states.includes(destinationState)) {
      return { 
        allowed: false, 
        reason: `${originRule.state_name} does not allow export to ${destRule.state_name}` 
      };
    }

    if (destRule.allowed_import_states?.length > 0 && 
        !destRule.allowed_import_states.includes(originState)) {
      return { 
        allowed: false, 
        reason: `${destRule.state_name} does not allow import from ${originRule.state_name}` 
      };
    }

    // Collect any requirements
    const requirements: string[] = [];

    // Check mileage restrictions if distance is provided
    if (distanceMiles) {
      // Check origin state mileage restrictions
      if (originRule.max_transport_miles && distanceMiles > originRule.max_transport_miles) {
        if (!originRule.requires_certification_beyond_miles) {
          return {
            allowed: false,
            reason: `${originRule.state_name} does not allow transport beyond ${originRule.max_transport_miles} miles`
          };
        } else if (originRule.certification_miles_threshold && distanceMiles > originRule.certification_miles_threshold) {
          requirements.push(
            `${originRule.state_name} requires certification for transport beyond ${originRule.certification_miles_threshold} miles: ${originRule.certification_details}`
          );
        }
      }

      // Check destination state mileage restrictions
      if (destRule.max_transport_miles && distanceMiles > destRule.max_transport_miles) {
        if (!destRule.requires_certification_beyond_miles) {
          return {
            allowed: false,
            reason: `${destRule.state_name} does not allow transport beyond ${destRule.max_transport_miles} miles`
          };
        } else if (destRule.certification_miles_threshold && distanceMiles > destRule.certification_miles_threshold) {
          requirements.push(
            `${destRule.state_name} requires certification for transport beyond ${destRule.certification_miles_threshold} miles: ${destRule.certification_details}`
          );
        }
      }
    }

    // Add certification requirements
    if (originRule.requires_certification) {
      requirements.push(
        `Export certification required from ${originRule.state_name}: ${originRule.certification_details}`
      );
    }

    if (destRule.requires_certification) {
      requirements.push(
        `Import certification required for ${destRule.state_name}: ${destRule.certification_details}`
      );
    }

    // Add additional requirements
    if (originRule.additional_requirements) {
      requirements.push(
        `${originRule.state_name} requirements: ${originRule.additional_requirements}`
      );
    }

    if (destRule.additional_requirements) {
      requirements.push(
        `${destRule.state_name} requirements: ${destRule.additional_requirements}`
      );
    }

    return {
      allowed: true,
      requirements: requirements.length > 0 ? requirements : undefined
    };
  } catch (err) {
    logger.error('Error checking state transport rules:', err);
    return { allowed: true }; // Default to allowed on error
  }
}
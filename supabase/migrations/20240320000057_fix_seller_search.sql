-- Drop existing views if they exist
drop view if exists seller_management cascade;
drop view if exists seller_payment_info cascade;

-- Create comprehensive seller view
create or replace view seller_search_view as
select 
    s.*,
    ca.stripe_account_id,
    ca.connected_at as stripe_connected_at,
    case 
        when ca.stripe_account_id is not null then true
        else false
    end as has_stripe_account,
    -- Extract state from business address using regex
    substring(s.business_address from '.*, ([A-Z]{2}) \d{5}.*') as state_code
from public.sellers s
left join public.connected_accounts ca on s.id = ca.seller_id
where s.status = 'approved';

-- Create function to check state transport rules
create or replace function check_transport_rules(
    origin_state text,
    destination_state text
) returns table (
    allowed boolean,
    reason text,
    requirements text[]
) as $$
declare
    origin_rule record;
    dest_rule record;
    requirements text[] := array[]::text[];
begin
    -- Get rules for both states
    select * into origin_rule from state_rules where state_code = origin_state;
    select * into dest_rule from state_rules where state_code = destination_state;

    -- Check if rules exist
    if origin_rule is null or dest_rule is null then
        return query select 
            false::boolean,
            'State rules not found'::text,
            null::text[];
        return;
    end if;

    -- Check export permission
    if not origin_rule.allows_export then
        return query select 
            false::boolean,
            format('%s does not allow firewood export', origin_rule.state_name)::text,
            null::text[];
        return;
    end if;

    -- Check import permission
    if not dest_rule.allows_import then
        return query select 
            false::boolean,
            format('%s does not allow firewood import', dest_rule.state_name)::text,
            null::text[];
        return;
    end if;

    -- Check specific state permissions
    if array_length(origin_rule.allowed_export_states, 1) > 0 and 
       not destination_state = any(origin_rule.allowed_export_states) then
        return query select 
            false::boolean,
            format('%s does not allow export to %s', origin_rule.state_name, dest_rule.state_name)::text,
            null::text[];
        return;
    end if;

    if array_length(dest_rule.allowed_import_states, 1) > 0 and 
       not origin_state = any(dest_rule.allowed_import_states) then
        return query select 
            false::boolean,
            format('%s does not allow import from %s', dest_rule.state_name, origin_rule.state_name)::text,
            null::text[];
        return;
    end if;

    -- Collect requirements
    if origin_rule.requires_certification then
        requirements := array_append(
            requirements,
            format('Export certification required from %s: %s', 
                   origin_rule.state_name, origin_rule.certification_details)
        );
    end if;

    if dest_rule.requires_certification then
        requirements := array_append(
            requirements,
            format('Import certification required for %s: %s', 
                   dest_rule.state_name, dest_rule.certification_details)
        );
    end if;

    if origin_rule.additional_requirements is not null then
        requirements := array_append(
            requirements,
            format('%s requirements: %s', 
                   origin_rule.state_name, origin_rule.additional_requirements)
        );
    end if;

    if dest_rule.additional_requirements is not null then
        requirements := array_append(
            requirements,
            format('%s requirements: %s', 
                   dest_rule.state_name, dest_rule.additional_requirements)
        );
    end if;

    return query select 
        true::boolean,
        null::text,
        requirements;
end;
$$ language plpgsql;

-- Create index for better performance
create index if not exists idx_seller_search_view_state_code 
    on public.sellers ((substring(business_address from '.*, ([A-Z]{2}) \d{5}.*')));

-- Grant permissions
grant select on seller_search_view to anon, authenticated;
grant execute on function check_transport_rules to anon, authenticated;
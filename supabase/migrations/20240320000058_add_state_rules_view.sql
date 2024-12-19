-- Create view for state rules with transport info
create or replace view state_rules_with_transport as
select 
    sr.*,
    array(
        select state_code 
        from state_rules sr2
        where sr2.state_code = any(sr.allowed_import_states)
    ) as importing_from_states,
    array(
        select state_code 
        from state_rules sr2
        where sr2.state_code = any(sr.allowed_export_states)
    ) as exporting_to_states
from state_rules sr;

-- Create function to get allowed transport states
create or replace function get_allowed_transport_states(
    state_code text,
    direction text
) returns text[] as $$
declare
    result text[];
begin
    if direction = 'import' then
        select array_agg(state_code)
        into result
        from state_rules
        where allows_export = true
        and (
            allowed_export_states is null
            or state_code = any(allowed_export_states)
        );
    else
        select array_agg(state_code)
        into result
        from state_rules
        where allows_import = true
        and (
            allowed_import_states is null
            or state_code = any(allowed_import_states)
        );
    end if;
    
    return result;
end;
$$ language plpgsql;

-- Grant permissions
grant select on state_rules_with_transport to anon, authenticated;
grant execute on function get_allowed_transport_states to anon, authenticated;
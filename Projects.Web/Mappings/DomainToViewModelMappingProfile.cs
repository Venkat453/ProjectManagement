using AutoMapper;
using Projects.Entities.Membership;
using Projects.Entities.MasterData;
using Projects.Web.Models;
using Projects.Entities.Projects;

namespace Projects.Web.Mappings
{
    public class DomainToViewModelMappingProfile : Profile
    {
        public override string ProfileName
        {
            get { return "DomainToViewModelMappings"; }
        }

        protected override void Configure()
        {
            Mapper.CreateMap <tbl_tenant, TenantViewModel>();
            Mapper.CreateMap<tbl_user, UsersViewModel>();
            Mapper.CreateMap<tbl_roles, RolesViewModel>();
            Mapper.CreateMap<tbl_login_track, LoginTrackViewModel>();
            Mapper.CreateMap<tbl_menu, MenuViewModel>();
            Mapper.CreateMap<tbl_menu_access, MenuAccessViewModel>();
            Mapper.CreateMap<tbl_error, ErrorLogViewModel>();

            Mapper.CreateMap <tbl_reference_master, referencemasterViewModel>();
            Mapper.CreateMap <tbl_country, CountryViewModel>();
            Mapper.CreateMap <tbl_state, StatesViewModel>();
            Mapper.CreateMap<tbl_city, CityViewModel>();
            Mapper.CreateMap<tbl_subcontractor, SubContractorViewModel>();
            Mapper.CreateMap<tbl_policestation, PoliceStationViewModel>();
            Mapper.CreateMap<tbl_junction, JunctionViewModel>();
            Mapper.CreateMap<tbl_labour, LabourViewModel>();
            Mapper.CreateMap<tbl_vehicle, VehicleViewModel>();
            Mapper.CreateMap<tbl_indent_header, IndentHeadViewModel>();
            Mapper.CreateMap<tbl_material_price, MaterialpriceViewModel>();
            Mapper.CreateMap<tbl_fieldwork_price, FieldworkViewModel>();
            Mapper.CreateMap<tbl_project_master, ProjectMasterViewModel>();
            Mapper.CreateMap<tbl_employee, EmployeeViewModel>();
            Mapper.CreateMap<tbl_induction, InductionViewModel>();
            Mapper.CreateMap<tbl_workassigns, WorkAssignmentViewModel>();
            Mapper.CreateMap<tbl_indentstatus, IndentStatusViewModel>();
            Mapper.CreateMap<tbl_indent_header, IndentHeadViewModel>();


            Mapper.CreateMap<tbl_workassigns, WorkAssignmentViewModel>();

            Mapper.CreateMap<tbl_workprogress, WorkProgressViewModel>();
            Mapper.CreateMap<tbl_project_components, ProjectComponentsViewModel>();
            Mapper.CreateMap<tbl_junctionComponents, Components>();
            Mapper.CreateMap<tbl_indent_details, IndentDetailsViewModel>();
            Mapper.CreateMap<tbl_subcontractor_ratechart, SubContractorRateChartViewModel>();
            Mapper.CreateMap<tbl_subcontractor_ratechart, RateChartItems>();
            Mapper.CreateMap<tbl_Workprogress_History, WorkProgressHistoryViewModel>();
            Mapper.CreateMap<tbl_workassigns_log, WorkAssignsLogViewModel>();
            Mapper.CreateMap<tbl_workverification_history, WorkVerificationHistoryViewModel>();
            Mapper.CreateMap<tbl_nonconfirmity_works, NonConfirmityWorksViewModel>();
            Mapper.CreateMap<tbl_nonconfirmity_history, NonConfirmityWorksHistoryViewModel>();
            Mapper.CreateMap<tbl_chartsorder, ChartOrderViewModel>();
            Mapper.CreateMap<tbl_Log, LogViewModel>();
            Mapper.CreateMap<tbl_charts_titles, ChartTitleViewModel>();
            Mapper.CreateMap<tbl_charts_titles, ChartTitlesViewModel>();
            Mapper.CreateMap<tbl_users_profiles, UserProfileViewModel>();



            //var config = new MapperConfiguration(cfg => {
            //    cfg.CreateMap<UsersViewModel, tbl_user>();
            //    cfg.CreateMap<ClientsViewModel, tbl_clients_master>();
            //    cfg.CreateMap<ProjectsViewModel, tbl_projects_master>();
            //    cfg.CreateMap<ProjectModulesViewModel, tbl_project_modules>();
            //    cfg.CreateMap<tbl_qa_checklist_master,QACheckListQuestionsViewModel >();
            //});
        }
    }
}
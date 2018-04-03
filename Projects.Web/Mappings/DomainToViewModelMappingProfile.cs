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
            Mapper.CreateMap<tbl_chartsorder, ChartOrderViewModel>();
            Mapper.CreateMap<tbl_Log, LogViewModel>();
            Mapper.CreateMap<tbl_charts_titles, ChartTitleViewModel>();
            Mapper.CreateMap<tbl_charts_titles, ChartTitlesViewModel>();
            Mapper.CreateMap<tbl_users_profiles, UserProfileViewModel>();
            Mapper.CreateMap<tbl_employee, EmployeeViewModel>();

            Mapper.CreateMap<tbl_project_master, ProjectMasterViewModel>();
            Mapper.CreateMap<tbl_project_master_child, ProjectMasterChildViewModel>();
            Mapper.CreateMap<tbl_project_commercial_data, ProjectCommercialDataViewModel>();
            Mapper.CreateMap<tbl_project_structure, ProjectStructureViewModel>();
            Mapper.CreateMap<tbl_project_structure_main, ProjectStructureMainViewModel>();
            Mapper.CreateMap<tbl_project_technical_data, ProjectTechnicalDataViewModel>();
            Mapper.CreateMap<tbl_project_technical_data_child, ProjectTechnicalDataChildViewModel>();
            Mapper.CreateMap<tbl_part_list, PartListViewModel>();
            Mapper.CreateMap<tbl_part_list_item, PartListItemViewModel>();




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
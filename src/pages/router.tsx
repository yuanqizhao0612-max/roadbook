import type { AppState, BookPageId } from '../data/types'

export interface PageCtx {
  state: AppState
  setState: (updater: (s: AppState) => AppState) => void
  goTo: (page: BookPageId, dir?: 'forward' | 'back') => void
  back: () => void
}

import CoverPage from './CoverPage'
import AgeSelectPage from './AgeSelectPage'
import IntentGatePage from './IntentGatePage'
import LibraryWallPage from './LibraryWallPage'
import ProfilePages from './ProfilePages'
import CurrentProblemPage from './CurrentProblemPage'
import NotAlonePage from './NotAlonePage'
import LibraryPage from './LibraryPage'
import CasePages from './CasePages'
import MethodUsePage from './MethodUsePage'
import DecisionRulerPage from './DecisionRulerPage'
import ForkSimPage from './ForkSimPage'
import Offer3QPage from './Offer3QPage'
import MyRoadbookPage from './MyRoadbookPage'
import LearningRoutePage from './LearningRoutePage'
import SkillDetailPage from './SkillDetailPage'
import DashboardPage from './DashboardPage'
import CaseLearningRoutePage from './CaseLearningRoutePage'
import TimeMachinePage from './TimeMachinePage'
import InsightDistillPage from './InsightDistillPage'
import ReflectionClosePage from './ReflectionClosePage'
import GrowthPathPage from './GrowthPathPage'
import RealWorldTaskPage from './RealWorldTaskPage'
import CheckinPage from './CheckinPage'
import AskRoadPage from './AskRoadPage'
import AskDiagnosisPage from './AskDiagnosisPage'
import LibraryHomePage from './LibraryHomePage'
import PitfallLibraryPage from './PitfallLibraryPage'
import WriteEntryPages from './WriteEntryPages'
import AgentTracePage from './AgentTracePage'
import AboutPage from './AboutPage'

export function renderPage(ctx: PageCtx): React.ReactNode {
  const p = ctx.state.page
  switch (p) {
    case 'cover': return <CoverPage {...ctx} />
    case 'age_select': return <AgeSelectPage {...ctx} />
    case 'intent_gate': return <IntentGatePage {...ctx} />
    case 'library_wall': return <LibraryWallPage {...ctx} />
    case 'profile_0': case 'profile_1': case 'profile_reflection': return <ProfilePages {...ctx} />
    case 'current_problem': return <CurrentProblemPage {...ctx} />
    case 'not_alone': return <NotAlonePage {...ctx} />
    case 'library': return <LibraryPage {...ctx} />
    case 'peer_cases': case 'lookback_case': case 'historical_case': return <CasePages {...ctx} />
    case 'method_use': return <MethodUsePage {...ctx} />
    case 'decision_ruler': return <DecisionRulerPage {...ctx} />
    case 'fork_sim': return <ForkSimPage {...ctx} />
    case 'offer_3q': return <Offer3QPage {...ctx} />
    case 'my_roadbook': return <MyRoadbookPage {...ctx} />
    case 'learning_route': return <LearningRoutePage {...ctx} />
    case 'skill_detail': return <SkillDetailPage {...ctx} />
    case 'case_learning_route': return <CaseLearningRoutePage {...ctx} />
    case 'time_machine': return <TimeMachinePage {...ctx} />
    case 'insight_distill': return <InsightDistillPage {...ctx} />
    case 'reflection_close': return <ReflectionClosePage {...ctx} />
    case 'growth_path': return <GrowthPathPage {...ctx} />
    case 'real_world_task': return <RealWorldTaskPage {...ctx} />
    case 'checkin': return <CheckinPage {...ctx} />
    case 'dashboard': return <DashboardPage {...ctx} />
    case 'ask_road': return <AskRoadPage {...ctx} />
    case 'ask_diagnosis': return <AskDiagnosisPage {...ctx} />
    case 'library_home': return <LibraryHomePage {...ctx} />
    case 'pitfall_library': return <PitfallLibraryPage {...ctx} />
    case 'write_entry_a': case 'write_entry_b': case 'submit_success':
      return <WriteEntryPages {...ctx} />
    case 'agent_trace': return <AgentTracePage {...ctx} />
    case 'about': return <AboutPage {...ctx} />
    default: return <CoverPage {...ctx} />
  }
}

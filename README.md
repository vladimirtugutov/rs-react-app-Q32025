# React. Task #8 React Performance

## React Performance Profiling Report

## Baseline Performance (Before Optimizations)

### Test Environment
- Browser: Chrome/Firefox
- Dataset: ~240 countries, ~270 years of data per country
- Date: [Current Date]

### Test Scenarios

#### 1. Sorting Performance
**Action:** Change sorting from "Name A-Z" to "Population descending"

![alt text](image.png)

**Metrics:**
- **Commit Duration:** 4.3s
- **Render Duration:** 1415.7ms  
- **Components Rendered:** ~240 components

**Interaction Details:**
- **Triggered by:** onChange (sort dropdown)
- **Total interaction time:** 4.3s
- **Root cause:** CountriesPage state change

**Ranked Chart (Top 3 slowest):**
1. YearlyTable: 297.7ms (multiple instances)
2. CountriesPage: 285.2ms  
3. CountryCard: ~50-100ms (multiple instances)

**Flame Graph:** [Screenshot attached]

**Analysis:** Every sort change triggers re-render of all country cards and data tables. YearlyTable components are the main performance bottleneck.

#### 2. Search Performance  
**Action:** Search for "United"
- **Commit Duration:** X.X ms
- **Components Rendered:** X components
- **Slowest Component:** ComponentName (X.X ms)
- **Screenshot:** [Flame Graph]

#### 3. Year Change Performance
**Action:** Change year from 2020 to 2019
- **Commit Duration:** X.X ms
- **Components Rendered:** X components
- **Slowest Component:** ComponentName (X.X ms)
- **Screenshot:** [Flame Graph]

#### 4. Column Selection Performance
**Action:** Remove "methane" column
- **Commit Duration:** X.X ms
- **Components Rendered:** X components
- **Slowest Component:** ComponentName (X.X ms)
- **Screenshot:** [Flame Graph]

### Key Findings (Baseline)
- Most expensive operations: [List]
- Components with unnecessary re-renders: [List]
- Performance bottlenecks identified: [List]

---

## Optimized Performance (After React.memo/useMemo)
[To be filled after optimization]

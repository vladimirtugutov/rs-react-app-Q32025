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

![alt text](image-1.png)

1. YearlyTable: 297.7ms (multiple instances)
2. CountriesPage: 285.2ms  
3. CountryCard: ~50-100ms (multiple instances)

**Flame Graph:** [Screenshot attached]

**Analysis:** Every sort change triggers re-render of all country cards and data tables. YearlyTable components are the main performance bottleneck.

#### 2. Search Performance  
**Action:** Search for "United"

![alt text](image-3.png)
![alt text](image-4.png)

**Metrics:**
- **Commit Duration:** 1.6s
- **Render Duration:** 12.8ms ✅ (vs 1415.7ms for sorting)
- **Components Rendered:** 3 countries found

**Interaction Details:**
- **Triggered by:** onChange (search input)
- **Total interaction time:** 1.6s
- **Root cause:** CountriesPage state change

**Ranked Chart (Top 4 slowest):**
1. CountriesPage: 3.7ms
2. YearlyTable: 2.1ms
3. YearlyTable: 1.9ms  
4. YearlyTable: 1.7ms

**Flame Graph:** [Both screenshots attached]

**Analysis:** Search is dramatically faster than sorting (12.8ms vs 1415.7ms render time) because filtering reduces the number of components. Only ~3 countries match "United", so only 3 YearlyTable components render instead of 240+.

**Key Finding:** Performance directly correlates with the number of YearlyTable instances rendered.


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

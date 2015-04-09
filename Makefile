#
# Command line settings
#

MAL_IMPL = js

#
# Settings
#

IMPLS = js

step0 = step0_repl
step1 = step1_read_print
step2 = step2_eval
step3 = step3_env
step4 = step4_if_fn_do
step5 = step5_tco
step6 = step6_file
step7 = step7_quote
step8 = step8_macros
step9 = step9_try
stepA = stepA_mal

EXCLUDE_PERFS = perf^mal  # TODO: fix this

#
# Utility functions
#

STEP_TEST_FILES = $(strip $(wildcard $(1)/tests/$($(2)).mal) $(wildcard tests/$($(2)).mal))

js_STEP_TO_PROG =      js/$($(1)).js

# Needed some argument munging
COMMA = ,
noop =
SPACE = $(noop) $(noop)

js_RUNSTEP =  iojs.exe --harmony_arrow_functions ../$(2) $(3)

# Derived lists
STEPS = $(sort $(filter step%,$(.VARIABLES)))
IMPL_TESTS = $(foreach impl,$(IMPLS),test^$(impl))
STEP_TESTS = $(foreach step,$(STEPS),test^$(step))
ALL_TESTS = $(filter-out $(EXCLUDE_TESTS),\
              $(strip $(sort \
                $(foreach impl,$(IMPLS),\
                  $(foreach step,$(STEPS),test^$(impl)^$(step))))))

IMPL_STATS = $(foreach impl,$(IMPLS),stats^$(impl))
IMPL_STATS_LISP = $(foreach impl,$(IMPLS),stats-lisp^$(impl))

IMPL_PERF = $(filter-out $(EXCLUDE_PERFS),$(foreach impl,$(IMPLS),perf^$(impl)))

#
# Build rules
#

# Build a program in 'c' directory
c/%:
	$(MAKE) -C $(dir $(@)) $(notdir $(@))

# Allow test, test^STEP, test^IMPL, and test^IMPL^STEP
.SECONDEXPANSION:
$(IMPL_TESTS): $$(filter $$@^%,$$(ALL_TESTS))

.SECONDEXPANSION:
$(STEP_TESTS): $$(foreach step,$$(subst test^,,$$@),$$(filter %^$$(step),$$(ALL_TESTS)))

.SECONDEXPANSION:
$(ALL_TESTS): $$(call $$(word 2,$$(subst ^, ,$$(@)))_STEP_TO_PROG,$$(word 3,$$(subst ^, ,$$(@))))
	@$(foreach impl,$(word 2,$(subst ^, ,$(@))),\
	  $(foreach step,$(word 3,$(subst ^, ,$(@))),\
	    cd $(if $(filter mal,$(impl)),$(MAL_IMPL),$(impl)); \
	    $(foreach test,$(call STEP_TEST_FILES,$(impl),$(step)),\
	      echo '----------------------------------------------'; \
	      echo 'Testing $@, step file: $+, test file: $(test)'; \
	      echo 'Running: ../runtest.py $(call $(impl)_TEST_OPTS) ../$(test) -- $(call $(impl)_RUNSTEP,$(step),$(+))'; \
	      ../runtest.py $(call $(impl)_TEST_OPTS) ../$(test) -- $(call $(impl)_RUNSTEP,$(step),$(+)))))

test: $(ALL_TESTS)
tests: $(ALL_TESTS)


# Stats rules

stats: $(IMPL_STATS)
stats-lisp: $(IMPL_STATS_LISP)

.SECONDEXPANSION:
$(IMPL_STATS):
	@echo "----------------------------------------------"; \
	$(foreach impl,$(word 2,$(subst ^, ,$(@))),\
	  echo "Stats for $(impl):"; \
	  $(MAKE) --no-print-directory -C $(impl) stats)

.SECONDEXPANSION:
$(IMPL_STATS_LISP):
	@echo "----------------------------------------------"; \
	$(foreach impl,$(word 2,$(subst ^, ,$(@))),\
	  echo "Stats (lisp only) for $(impl):"; \
	  $(MAKE) --no-print-directory -C $(impl) stats-lisp)


# Performance test rules

perf: $(IMPL_PERF)

.SECONDEXPANSION:
$(IMPL_PERF):
	@echo "----------------------------------------------"; \
	$(foreach impl,$(word 2,$(subst ^, ,$(@))),\
	  cd $(if $(filter mal,$(impl)),$(MAL_IMPL),$(impl)); \
	  echo "Performance test for $(impl):"; \
	  echo 'Running: $(call $(impl)_RUNSTEP,stepA,$(call $(impl)_STEP_TO_PROG,stepA),../tests/perf1.mal)'; \
          $(call $(impl)_RUNSTEP,stepA,$(call $(impl)_STEP_TO_PROG,stepA),../tests/perf1.mal); \
	  echo 'Running: $(call $(impl)_RUNSTEP,stepA,$(call $(impl)_STEP_TO_PROG,stepA),../tests/perf2.mal)'; \
          $(call $(impl)_RUNSTEP,stepA,$(call $(impl)_STEP_TO_PROG,stepA),../tests/perf2.mal); \
	  echo 'Running: $(call $(impl)_RUNSTEP,stepA,$(call $(impl)_STEP_TO_PROG,stepA),../tests/perf3.mal)'; \
          $(call $(impl)_RUNSTEP,stepA,$(call $(impl)_STEP_TO_PROG,stepA),../tests/perf3.mal))


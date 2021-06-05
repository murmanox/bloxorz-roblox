interface StarterGui extends BasePlayerGui {
	ScreenGui: ScreenGui & {
		vignette: ImageLabel
		ViewportFrame: ViewportFrame & {
			LocalScript: LocalScript
			axis: Model & {
				Y: Part
				X: Part
				Z: Part
				origin: Part
			}
		}
		game_gui: Frame & {
			top_bar: Frame & {
				stars: Frame & {
					value: TextLabel & {
						UIPadding: UIPadding
					}
					text: TextLabel & {
						UIPadding: UIPadding
					}
				}
				UIStroke: UIStroke
				exit: Frame & {
					value: TextLabel & {
						UIPadding: UIPadding
					}
					text: TextLabel & {
						UIPadding: UIPadding
					}
				}
				moves: Frame & {
					value: TextLabel & {
						UIPadding: UIPadding
					}
					text: TextLabel & {
						UIPadding: UIPadding
					}
				}
			}
			menu: Frame & {
				UIPadding: UIPadding
				Frame: Frame & {
					stats: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					["continue"]: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					restart: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					UIListLayout: UIListLayout
					spacer: Frame & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					level_select: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					settings: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
				}
			}
			level_details: Frame & {
				title: Folder & {
					text_shadow: TextLabel
					text: TextLabel
				}
				description: Folder & {
					text_shadow: TextLabel
					text: TextLabel
				}
				ImageLabel: ImageLabel
			}
		}
		level_select: Frame & {
			controls: Frame
			UIPadding: UIPadding
			display: Frame & {
				UIPadding: UIPadding
				scrolling: ScrollingFrame & {
					UIPadding: UIPadding
					UIGridLayout: UIGridLayout & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
				}
			}
			Header: Frame & {
				TextLabel: TextLabel
			}
			ImageLabel: ImageLabel & {
				TextLabel: TextLabel
			}
		}
		main_menu: Frame & {
			stats: Frame & {
				Frame: Frame & {
					stats_scrolling_frame: ScrollingFrame & {
						time_category: Frame & {
							stat1: Frame & {
								value: TextLabel & {
									UIPadding: UIPadding
								}
								name: TextLabel & {
									UIPadding: UIPadding
								}
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							UIListLayout: UIListLayout
						}
						tile_category: Frame & {
							UIListLayout: UIListLayout
							stat7: Frame & {
								value: TextLabel & {
									UIPadding: UIPadding
								}
								name: TextLabel & {
									UIPadding: UIPadding
								}
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							stat6: Frame & {
								value: TextLabel & {
									UIPadding: UIPadding
								}
								name: TextLabel & {
									UIPadding: UIPadding
								}
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							stat5: Frame & {
								value: TextLabel & {
									UIPadding: UIPadding
								}
								name: TextLabel & {
									UIPadding: UIPadding
								}
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
						}
						UIListLayout: UIListLayout
						UIPadding: UIPadding
						gameplay_category: Frame & {
							UIListLayout: UIListLayout
							stat3: Frame & {
								value: TextLabel & {
									UIPadding: UIPadding
								}
								name: TextLabel & {
									UIPadding: UIPadding
								}
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							stat2: Frame & {
								value: TextLabel & {
									UIPadding: UIPadding
								}
								name: TextLabel & {
									UIPadding: UIPadding
								}
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							stat4: Frame & {
								value: TextLabel & {
									UIPadding: UIPadding
								}
								name: TextLabel & {
									UIPadding: UIPadding
								}
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
						}
					}
				}
				UIPadding: UIPadding
				Header: TextLabel
			}
			settings: Frame & {
				Frame: Frame & {
					audio_scrolling_frame: ScrollingFrame & {
						UIPadding: UIPadding
						UIListLayout: UIListLayout
						ambient_volume: Frame & {
							value: Frame & {
								slider: Frame & {
									right_half: Frame
									left_half: Frame
									ImageLabel: ImageLabel
								}
							}
							name: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
						sound_volume: Frame & {
							value: Frame & {
								slider: Frame & {
									right_half: Frame
									left_half: Frame
									ImageLabel: ImageLabel
								}
							}
							name: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
						music_volume: Frame & {
							value: Frame & {
								slider: Frame & {
									right_half: Frame
									left_half: Frame
									ImageLabel: ImageLabel
								}
							}
							name: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
					}
					controller_scrolling_frame: ScrollingFrame & {
						UIPadding: UIPadding
						UIListLayout: UIListLayout
						ambient_volume: Frame & {
							value: Frame & {
								slider: Frame & {
									right_half: Frame
									left_half: Frame
									ImageLabel: ImageLabel
								}
							}
							name: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
						sound_volume: Frame & {
							value: Frame & {
								slider: Frame & {
									right_half: Frame
									left_half: Frame
									ImageLabel: ImageLabel
								}
							}
							name: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
						music_volume: Frame & {
							value: Frame & {
								slider: Frame & {
									right_half: Frame
									left_half: Frame
									ImageLabel: ImageLabel
								}
							}
							name: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
					}
					category_headers: Frame & {
						selection_box: Frame & {
							UIStroke: UIStroke
						}
						audio: Frame & {
							TextLabel: TextLabel & {
								UIPadding: UIPadding
							}
						}
						graphics: Frame & {
							TextLabel: TextLabel & {
								UIPadding: UIPadding
							}
						}
						controller: Frame & {
							TextLabel: TextLabel & {
								UIPadding: UIPadding
							}
						}
						keybinds: Frame & {
							TextLabel: TextLabel & {
								UIPadding: UIPadding
							}
						}
						UIPadding: UIPadding
					}
					graphics_scrolling_frame: ScrollingFrame & {
						UIPadding: UIPadding
						UIListLayout: UIListLayout
						ambient_volume: Frame & {
							value: Frame & {
								slider: Frame & {
									right_half: Frame
									left_half: Frame
									ImageLabel: ImageLabel
								}
							}
							name: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
						sound_volume: Frame & {
							value: Frame & {
								slider: Frame & {
									right_half: Frame
									left_half: Frame
									ImageLabel: ImageLabel
								}
							}
							name: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
						music_volume: Frame & {
							value: Frame & {
								slider: Frame & {
									right_half: Frame
									left_half: Frame
									ImageLabel: ImageLabel
								}
							}
							name: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
					}
					keybind_scrolling_frame: ScrollingFrame & {
						down_keybind: Frame & {
							primary_value: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
							name: TextLabel & {
								UIPadding: UIPadding
							}
							secondary_value: TextLabel & {
								UIPadding: UIPadding
							}
						}
						UIPadding: UIPadding
						UIListLayout: UIListLayout
						right_keybind: Frame & {
							primary_value: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
							name: TextLabel & {
								UIPadding: UIPadding
							}
							secondary_value: TextLabel & {
								UIPadding: UIPadding
							}
						}
						left_keybind: Frame & {
							primary_value: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
							name: TextLabel & {
								UIPadding: UIPadding
							}
							secondary_value: TextLabel & {
								UIPadding: UIPadding
							}
						}
						up_keybind: Frame & {
							primary_value: TextLabel & {
								UIPadding: UIPadding
							}
							UIAspectRatioConstraint: UIAspectRatioConstraint
							name: TextLabel & {
								UIPadding: UIPadding
							}
							secondary_value: TextLabel & {
								UIPadding: UIPadding
							}
						}
					}
				}
				UIPadding: UIPadding
				Header: TextLabel
			}
			credits: Frame & {
				Frame: Frame & {
					credits_scrolling_frame: ScrollingFrame & {
						programmer_category: Frame & {
							value: TextLabel & {
								UIPadding: UIPadding
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							name: TextLabel & {
								UIPadding: UIPadding
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							UIListLayout: UIListLayout
						}
						UIPadding: UIPadding
						audio_category: Frame & {
							value: TextLabel & {
								UIPadding: UIPadding
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							name: TextLabel & {
								UIPadding: UIPadding
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							UIListLayout: UIListLayout
						}
						UIListLayout: UIListLayout
						interface_category: Frame & {
							value: TextLabel & {
								UIPadding: UIPadding
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							name: TextLabel & {
								UIPadding: UIPadding
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							UIListLayout: UIListLayout
						}
						inspired_by_category: Frame & {
							name: TextLabel & {
								UIPadding: UIPadding
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							UIListLayout: UIListLayout
						}
						special_thanks_category: Frame & {
							value: TextLabel & {
								UIPadding: UIPadding
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							name: TextLabel & {
								UIPadding: UIPadding
								UIAspectRatioConstraint: UIAspectRatioConstraint
							}
							UIListLayout: UIListLayout
						}
					}
				}
				UIPadding: UIPadding
				Header: TextLabel
			}
			level_select: Frame & {
				Frame: Frame & {
					stats_scrolling_frame: ScrollingFrame & {
						level_8: Frame & {
							locked_overlay: Frame & {
								UICorner: UICorner
								vignette: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
									UICorner: UICorner
								}
								gradient: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
								lock: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
							}
							TextLabel: TextLabel
							UICorner: UICorner
							UIStroke: UIStroke
							level_image: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint
								UICorner: UICorner
							}
							unlocked_overlay: Frame & {
								star_overlay: Frame & {
									right_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
									left_star: Frame & {
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
									}
									gradient: ImageLabel
									middle_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
								}
							}
						}
						UIPadding: UIPadding
						level_5: Frame & {
							locked_overlay: Frame & {
								UICorner: UICorner
								vignette: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
									UICorner: UICorner
								}
								gradient: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
								lock: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
							}
							TextLabel: TextLabel
							UICorner: UICorner
							UIStroke: UIStroke
							level_image: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint
								UICorner: UICorner
							}
							unlocked_overlay: Frame & {
								star_overlay: Frame & {
									right_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
									left_star: Frame & {
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
									}
									gradient: ImageLabel
									middle_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
								}
							}
						}
						level_4: Frame & {
							locked_overlay: Frame & {
								UICorner: UICorner
								vignette: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
									UICorner: UICorner
								}
								gradient: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
								lock: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
							}
							level_image: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint
								UICorner: UICorner
							}
							UICorner: UICorner
							UIStroke: UIStroke
							TextLabel: TextLabel
							unlocked_overlay: Frame & {
								star_overlay: Frame & {
									right_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
									left_star: Frame & {
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
									}
									gradient: ImageLabel
									middle_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
								}
							}
						}
						level_7: Frame & {
							locked_overlay: Frame & {
								UICorner: UICorner
								vignette: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
									UICorner: UICorner
								}
								gradient: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
								lock: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
							}
							TextLabel: TextLabel
							UICorner: UICorner
							UIStroke: UIStroke
							level_image: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint
								UICorner: UICorner
							}
							unlocked_overlay: Frame & {
								star_overlay: Frame & {
									right_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
									left_star: Frame & {
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
									}
									gradient: ImageLabel
									middle_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
								}
							}
						}
						level_6: Frame & {
							locked_overlay: Frame & {
								UICorner: UICorner
								vignette: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
									UICorner: UICorner
								}
								gradient: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
								lock: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
							}
							TextLabel: TextLabel
							UICorner: UICorner
							UIStroke: UIStroke
							level_image: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint
								UICorner: UICorner
							}
							unlocked_overlay: Frame & {
								star_overlay: Frame & {
									right_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
									left_star: Frame & {
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
									}
									gradient: ImageLabel
									middle_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
								}
							}
						}
						level_3: Frame & {
							locked_overlay: Frame & {
								UICorner: UICorner
								vignette: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
									UICorner: UICorner
								}
								gradient: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
								lock: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
							}
							TextLabel: TextLabel
							UICorner: UICorner
							UIStroke: UIStroke
							level_image: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint
								UICorner: UICorner
							}
							unlocked_overlay: Frame & {
								star_overlay: Frame & {
									right_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
									left_star: Frame & {
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
									}
									gradient: ImageLabel
									middle_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
								}
							}
						}
						UIGridLayout: UIGridLayout & {
							UIAspectRatioConstraint: UIAspectRatioConstraint
						}
						level_1: Frame & {
							locked_overlay: Frame & {
								UICorner: UICorner
								vignette: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
									UICorner: UICorner
								}
								gradient: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
								lock: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
							}
							TextLabel: TextLabel
							UICorner: UICorner
							UIStroke: UIStroke
							level_image: ImageLabel & {
								UICorner: UICorner
								UIAspectRatioConstraint: UIAspectRatioConstraint
								UIGradient: UIGradient
							}
							unlocked_overlay: Frame & {
								star_overlay: Frame & {
									right_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
									left_star: Frame & {
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
									}
									gradient: ImageLabel
									middle_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
								}
							}
						}
						level_2: Frame & {
							locked_overlay: Frame & {
								UICorner: UICorner
								vignette: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
									UICorner: UICorner
								}
								gradient: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
								lock: ImageLabel & {
									UIAspectRatioConstraint: UIAspectRatioConstraint
								}
							}
							TextLabel: TextLabel
							UICorner: UICorner
							UIStroke: UIStroke
							level_image: ImageLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint
								UICorner: UICorner
							}
							unlocked_overlay: Frame & {
								star_overlay: Frame & {
									right_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
									left_star: Frame & {
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
									}
									gradient: ImageLabel
									middle_star: Frame & {
										collected: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
										}
										missed: ImageLabel & {
											UIAspectRatioConstraint: UIAspectRatioConstraint
											middle_star: ImageLabel
										}
									}
								}
							}
						}
					}
				}
				UIPadding: UIPadding
				Header: TextLabel
			}
			main_menu: Frame & {
				UIPadding: UIPadding
				Frame: Frame & {
					spacer: Frame & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					stats: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					["continue"]: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					settings: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					UIListLayout: UIListLayout
					updates: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
					level_select: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
						selection_box: Frame & {
							UIStroke: UIStroke
						}
					}
					credits: TextButton & {
						UIAspectRatioConstraint: UIAspectRatioConstraint
					}
				}
			}
		}
	}
	debugging: ScreenGui
}
